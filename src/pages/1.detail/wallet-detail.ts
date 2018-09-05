import { Logger } from '../../providers/common/logger/logger';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Navbar, InfiniteScroll, NavParams } from 'ionic-angular';
import { AppServiceProvider } from '../../providers/app/app.service';
import { NWallet } from '../../interfaces/nwallet';
import * as _ from 'lodash';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { WalletMainTabPage } from '../0.tab/3.wallet-tab/wallet-main-tab';
/**
 * Generated class for the WalletDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'wallet-detail',
    templateUrl: 'wallet-detail.html',
})
export class WalletDetailPage {
    public transactionMaps: Array<{ date: string; transactions: NWallet.Protocol.Transaction[] }> = new Array<{ date: string; transactions: NWallet.Protocol.Transaction[] }>();
    private skip = 0;
    private asset = {};
    @ViewChild(Navbar) navBar: Navbar;

    constructor(public navCtrl: NavController, private logger: Logger, private appService: AppServiceProvider, private browser: InAppBrowser, private navParams: NavParams) {
        const wallet = navParams.get('wallet');
        if (wallet.item.asset.code === 'XLM' || wallet.item.asset.code === 'NCN') {
            this.init();
        }
        this.asset = wallet;
        console.log('WalletDetailPage', navParams.get('wallet'));
    }

    private async init(): Promise<void> {
        console.log(this);
        const transactions = await this.appService.getTransfer();
        this.arrange(transactions);
    }

    private arrange(transactions: NWallet.Protocol.Transaction[]): void {
        const transactionGroups = _.groupBy(transactions, (t: NWallet.Protocol.Transaction) => {
            return new Date(t.created_date.getFullYear(), t.created_date.getMonth(), t.created_date.getDate());
        });

        Object.keys(transactionGroups).forEach(date => {
            const transfers = transactionGroups[date];
            const transactionMap = this.transactionMaps.find(map => map.date === date);

            if (transactionMap) {
                transactionMap.transactions.push(...transfers);
            } else {
                this.transactionMaps.push({ date: date, transactions: transfers });
            }
        });

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

    public onBackButton() {
        console.log('backbutton');
        this.navCtrl.push(
            WalletMainTabPage,
            null,
            {
                animate: true,
                animation: 'ios-transition',
            },
        );
    }
}
