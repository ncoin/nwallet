import { SendPage } from '../../1.transfer-tab/send/send.page';
import { LoggerService } from '../../../../providers/common/logger/logger.service';
import { Component, ViewChild, OnDestroy } from '@angular/core';
import { IonicPage, Navbar, InfiniteScroll, NavParams, ViewController, ModalController, NavController } from 'ionic-angular';
import * as _ from 'lodash';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { NWTransaction, NWAsset } from '../../../../models/nwallet';
import { ModalBasePage } from '../../../0.base/modal.page';
import { ModalNavPage } from '../../../0.base/modal-nav.page';
import { AccountService } from '../../../../providers/account/account.service';
import { Subscription } from 'rxjs';
import { EventService } from '../../../../providers/common/event/event';
import { NsusChannelService } from '../../../../providers/nsus/nsus-channel.service';
import { NWEvent } from '../../../../interfaces/events';

@IonicPage()
@Component({
    selector: 'wallet-detail',
    templateUrl: 'wallet-detail.page.html'
})
export class WalletDetailPage extends ModalBasePage implements OnDestroy {
    public transactionMaps: Array<{ date: string; transactions: NWTransaction.Item[] }> = new Array<{ date: string; transactions: NWTransaction.Item[] }>();
    private skip = 0;
    private limit = 10;
    public asset: NWAsset.Item;
    private subscriptions: Subscription[] = [];
    constructor(
        navCtrl: NavController,
        params: NavParams,
        parent: ModalNavPage,
        private logger: LoggerService,
        private browser: InAppBrowser,
        private account: AccountService,
        private event: EventService
    ) {
        super(navCtrl, params, parent);
        this.asset = params.get('asset');
        this.init();
    }

    private async init(): Promise<void> {
        this.account.registerSubjects(account => {
            this.subscriptions.push(account.assetTransaction(this.asset.getWalletId(), this.arrange));
        });

        this.account.getTransactions(this.asset.getWalletId(), this.skip, this.limit);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    private arrange = (transactions: NWTransaction.Item[]): void => {
        if (transactions.length < 1) {
            return;
        }

        const transactionGroups = _.groupBy(transactions, (t: NWTransaction.Item) => {
            return t.groupDate;
        });

        Object.keys(transactionGroups).forEach(date => {
            const transfers = transactionGroups[date];
            const transactionMap = this.transactionMaps.find(map => map.date === date);
            if (transactionMap) {
                const filtered = transfers.filter(t => !transactionMap.transactions.find(tt => tt.getId() === t.getId()));
                transactionMap.transactions.push(...filtered);
            } else {
                this.transactionMaps.push({ date: date, transactions: transfers });
            }
        });
        this.skip = transactions.length;
    }

    public async doInfinite(infinite: InfiniteScroll): Promise<void> {
        const transactions = await this.account.getTransactions(this.asset.getWalletId(), this.skip, this.limit);
        if (transactions.length < 1) {
            this.logger.debug('[transfer-tab-page] response transfers length =', transactions.length);
            infinite.enable(false);
            return;
        }

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

    public onClick_Receive(): void {
        this.event.publish(NWEvent.App.change_tab, { index: 1, currencyId: this.asset.getCurrencyId() });
        this.parent.close();
    }

    public onClick_Loan(): void {}
}
