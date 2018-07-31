import { Logger } from './../../../providers/common/logger/logger';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Navbar, InfiniteScroll, ToastController } from 'ionic-angular';
import { AppServiceProvider } from '../../../providers/app/app.service';
import { NWallet } from '../../../interfaces/nwallet';
import * as _ from 'lodash';
import { InAppBrowser } from '@ionic-native/in-app-browser';
/**
 * Generated class for the WalletDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-transfer-tab',
    templateUrl: 'transfer-tab.html',
})
export class TransferTabPage {

    public transactionMaps: Array<{ date: Date, transactions: NWallet.Protocol.Transaction[]}> = new Array<{ date: Date, transactions: NWallet.Protocol.Transaction[]}>();
    private skip = 0;
    @ViewChild(Navbar) navBar: Navbar;

    constructor(public navCtrl: NavController, private logger: Logger, private toast: ToastController, private appService: AppServiceProvider, private browser: InAppBrowser) {
        this.init();
    }

    private async init(): Promise<void> {
        const transactions = await this.appService.getTransfer();
        this.arrange(transactions);
    }

    private arrange(transactions: NWallet.Protocol.Transaction[]): void {

        const transactionGroups = _.groupBy(transactions, (t: NWallet.Protocol.Transaction) => {
            const date = new Date();
            date.setFullYear(t.created_date.getFullYear());
            date.setMonth(t.created_date.getMonth());
            date.setDate(t.created_date.getDate());
            return date;
        });

        // tslint:disable-next-line:forin
        for (const groupDateKey in transactionGroups) {

            const targetMap = this.transactionMaps.find(map => {
                return map.date.toString() === groupDateKey;
            });

            const transfers = transactionGroups[groupDateKey];

            if (targetMap) {
                targetMap.transactions.push(...transfers);
            } else {
                this.transactionMaps.push({date : new Date(groupDateKey), transactions : transfers});
            }
        }

        this.skip += transactions.length;
    }

    public async doInfinite(infinite: InfiniteScroll): Promise<void> {

        this.logger.debug('[transfer-tab-page] request transfers skip =', this.skip);
        const transactions = await this.appService.getTransfer(this.skip);
        if (transactions.length < 1) {
            this.logger.debug('[transfer-tab-page] response transfers length =', transactions.length);
            infinite.enable(false);
            return;
        }

        this.arrange(transactions);
        infinite.complete();
    }

    public onExploreTransaction(transaction: NWallet.Protocol.Transaction): void {
        const browser = this.browser.create(`https://stellar.expert/explorer/testnet/tx/${transaction.transaction_hash}`, '_blank', {
            location: 'no',
            clearcache: 'yes',
            footer: 'yes',
            toolbar: 'no',
            closebuttoncaption: 'done',
        });

        browser.insertCSS({
            code: 'body { margin-top : 50px;}',
        });

        browser.show();
    }
}
