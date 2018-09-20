import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Navbar, InfiniteScroll } from 'ionic-angular';
import { ModalController } from '@ionic/angular';
import * as _ from 'lodash';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ReceivePage } from '$pages/0.tab/1.transfer-tab/receive/receive.page';
import { SendPage } from '$pages/0.tab/1.transfer-tab/send/send.page';
import { NWallet } from '$infrastructure/nwallet';
import { LoggerService } from '$services/cores/logger/logger.service';
import { NWalletService } from '$services/app/nwallet.service';
/**
 * Generated class for the WalletDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'transfer-history-tab',
    templateUrl: 'transfer-history-tab.html'
})
export class TransferHistoryTabPage {
    public transactionMaps: Array<{ date: string; transactions: NWallet.Protocol.Transaction[] }> = new Array<{
        date: string;
        transactions: NWallet.Protocol.Transaction[];
    }>();
    private skip = 0;
    @ViewChild(Navbar)
    navBar: Navbar;

    constructor(
        public navCtrl: NavController,
        private logger: LoggerService,
        private appService: NWalletService,
        private browser: InAppBrowser,
        private modal: ModalController
    ) {
        this.init();
    }

    private async init(): Promise<void> {
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
            toolbar: 'yes',
            closebuttoncaption: 'done'
        });

        browser.insertCSS({
            code: 'body { margin-top : 50px;}'
        });

        browser.show();
    }

    public async onReceiveClick(): Promise<void> {
        const modal = await this.modal.create({
            component: ReceivePage
        });
        await modal.present();
    }

    public async onSendClick(): Promise<void> {
        const modal = await this.modal.create({
            component: SendPage
        });

        await modal.present();
    }
}
