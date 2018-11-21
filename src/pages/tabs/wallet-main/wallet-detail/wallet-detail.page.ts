import { LoggerService } from '../../../../services/common/logger/logger.service';
import { Component, ViewChild, OnDestroy } from '@angular/core';
import { IonicPage, Navbar, InfiniteScroll, NavParams, ViewController, ModalController, NavController } from 'ionic-angular';
import * as _ from 'lodash';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { NWTransaction, NWAsset } from '../../../../models/nwallet';
import { ModalBasePage } from '../../../base/modal.page';
import { ModalNavPage } from '../../../base/modal-nav.page';
import { AccountService } from '../../../../services/account/account.service';
import { Subscription } from 'rxjs';
import { EventService } from '../../../../services/common/event/event';
import { NsusChannelService } from '../../../../services/nsus/nsus-channel.service';
import { NWEvent } from '../../../../interfaces/events';
import { WalletTransactionDetailPage } from './wallet-transaction-detail.page';
import { NWTransition } from '../../../../tools/extension/transition';

@IonicPage()
@Component({
    selector: 'wallet-detail',
    templateUrl: 'wallet-detail.page.html'
})
export class WalletDetailPage extends ModalBasePage implements OnDestroy {
    public transactionMaps: Array<{ date: string; transactions: NWTransaction.Item[]; time: number }> = new Array<{
        date: string;
        transactions: NWTransaction.Item[];
        time: number;
    }>();
    private skip = 0;
    private limit = 10;
    public asset: NWAsset.Item;
    private subscriptions: Subscription[] = [];
    constructor(navCtrl: NavController, params: NavParams, parent: ModalNavPage, private logger: LoggerService, private account: AccountService, private event: EventService) {
        super(navCtrl, params, parent);
        this.asset = params.get('asset');
        this.init();
    }

    private async init(): Promise<void> {
        this.account.registerSubjects(account => {
            this.subscriptions.push(account.assetTransaction(this.asset.getWalletId(), this.arrange));
        });

        this.account.getTransactions(this.asset.getWalletId(), 0, this.limit);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    private arrange = (transactions: NWTransaction.Item[]): void => {
        if (transactions.length < 1) {
            return;
        }

        const transactionGroups = _.groupBy(transactions, (t: NWTransaction.Item) => t.groupDate);

        // fixme --sky`
        Object.keys(transactionGroups).forEach(date => {
            const transfers = transactionGroups[date];
            const transactionMap = this.transactionMaps.find(map => map.date === date);
            if (transactionMap) {
                const filtered = transfers.filter(t => !transactionMap.transactions.find(tt => tt.id === t.id));
                transactionMap.transactions.push(...filtered);
                transactionMap.transactions.sort((t1, t2) => t2.id - t1.id);
            } else {
                this.transactionMaps.push({ date: date, transactions: transfers, time: new Date(date).getTime() });
                this.transactionMaps.sort((map1, map2) => map2.time - map1.time);
            }
        });
        this.skip = transactions.length;

        const a = this.asset;
        this.asset = undefined;
        this.asset = a;
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
        this.navCtrl.push(WalletTransactionDetailPage, { transaction: transaction }, NWTransition.Slide('left'));
    }

    public onClick_Receive(): void {
        this.event.publish(NWEvent.App.change_tab, { index: 1, currencyId: this.asset.getCurrencyId() });
        this.parent.close();
    }

    public onClick_Loan(): void {}
}
