import { LoggerService } from '../../../providers/common/logger/logger.service';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Navbar, InfiniteScroll, ModalController } from 'ionic-angular';
import { NWalletAppService } from '../../../providers/app/app.service';
import * as _ from 'lodash';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ReceivePage } from './receive/receive.page';
import { NWTransition, NWModalTransition } from '../../../tools/extension/transition';
import { SendPage } from './send/send.page';
import { NWTransaction } from '../../../models/nwallet';
/**
 * Generated class for the WalletDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'transfer-history-tab',
    templateUrl: 'transfer-history-tab.html',
})
export class TransferHistoryTabPage {
    public transactionMaps: Array<{ date: string; transactions: NWTransaction.Item[] }> = new Array<{ date: string; transactions: NWTransaction.Item[] }>();
    private skip = 0;
    @ViewChild(Navbar)
    navBar: Navbar;

    constructor(
        public navCtrl: NavController,
        private logger: LoggerService,
        private appService: NWalletAppService,
        private browser: InAppBrowser,
        private modal: ModalController
    ) {
        this.init();
    }

    private async init(): Promise<void> {
        const transactions = await this.appService.getTransfer();
        this.arrange(transactions);
    }

    private arrange(transactions: NWTransaction.Item[]): void {
        const transactionGroups = _.groupBy(transactions, (t: NWTransaction.Item) => {
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

    public onExploreTransaction(transaction: NWTransaction.Item): void {
        // const browser = this.browser.create(`https://stellar.expert/explorer/testnet/tx/${transaction.transaction_hash}`, '_blank', {
        //     location: 'no',
        //     clearcache: 'yes',
        //     footer: 'yes',
        //     toolbar: 'yes',
        //     closebuttoncaption: 'done',
        // });

        // browser.insertCSS({
        //     code: 'body { margin-top : 50px;}',
        // });

        // browser.show();
    }

    public onReceiveClick(): void {
        const modal = this.modal.create(ReceivePage, {}, NWModalTransition.Slide());
        modal.present();
    }

    public onSendClick(): void {
        const modal = this.modal.create(SendPage, {}, NWModalTransition.Slide());
        modal.present();
    }
}
