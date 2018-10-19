import { SendPage } from '../../1.transfer-tab/send/send.page';
import { ReceivePage } from '../../1.transfer-tab/receive/receive.page';
import { LoggerService } from '../../../../providers/common/logger/logger.service';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, Navbar, InfiniteScroll, NavParams, ViewController, ModalController, NavController } from 'ionic-angular';
import { NWalletAppService } from '../../../../providers/app/app.service';
import * as _ from 'lodash';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { NWModalTransition } from '../../../../tools/extension/transition';
import { NWTransaction, NWAsset } from '../../../../models/nwallet';
import { ModalBasePage } from '../../../0.base/modal.page';
import { ModalNavPage } from '../../../0.base/modal-nav.page';
import { AccountService } from '../../../../providers/account/account.service';
import { Subscription } from 'rxjs';

@IonicPage()
@Component({
    selector: 'wallet-detail',
    templateUrl: 'wallet-detail.page.html'
})
export class WalletDetailPage extends ModalBasePage {
    public transactionMaps: Array<{ date: string; transactions: NWTransaction.Item[] }> = new Array<{ date: string; transactions: NWTransaction.Item[] }>();
    private skip = 0;
    public wallet: NWAsset.Item;
    private subscriptions: Subscription[] = [];
    constructor(
        navCtrl: NavController,
        params: NavParams,
        parent: ModalNavPage,
        private logger: LoggerService,
        private account: AccountService,
        private appService: NWalletAppService,
        private browser: InAppBrowser
    ) {
        super(navCtrl, params, parent);
        this.init();
    }

    private async init(): Promise<void> {
        this.account.registerAccountStream(account => {});
        const transactions = await this.appService.getTransfer();
        this.arrange(transactions);
    }

    ionViewDidLeave() {
        this.subscriptions.forEach(s => s.unsubscribe());
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
        //     toolbar: 'no',
        //     closebuttoncaption: 'done',
        // });
        // browser.insertCSS({
        //     code: 'body { margin-top : 50px;}',
        // });
        // browser.show();
    }

    public onReceiveClick(): void {
        const modal = this.modal.create(ReceivePage, { asset: this.wallet }, NWModalTransition.Slide());
        modal.present();
    }

    public onSendClick(): void {
        const modal = this.modal.create(SendPage, { asset: this.wallet }, NWModalTransition.Slide());
        modal.present();
    }

    public onClose() {
        this.viewCtrl.dismiss();
    }
}
