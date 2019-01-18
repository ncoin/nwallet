import { LoggerService } from '../../../../services/common/logger/logger.service';
import { Component, ViewChild, OnDestroy } from '@angular/core';
import { IonicPage, Navbar, InfiniteScroll, NavParams, NavController, ModalController } from 'ionic-angular';
import * as _ from 'lodash';
import { NWTransaction, NWAsset } from '../../../../models/nwallet';
import { ModalBasePage } from '../../../base/modal.page';
import { ModalNavPage } from '../../../base/modal-nav.page';
import { AccountService } from '../../../../services/account/account.service';
import { Subscription } from 'rxjs';
import { EventService } from '../../../../services/common/event/event.service';
import { ChannelService } from '../../../../services/nwallet/channel.service';
import { NWEvent } from '../../../../interfaces/events';
import { WalletTransactionDetailPage } from './wallet-transaction-detail.page';
import { NWTransition } from '../../../../tools/extension/transition';
import { SendPage } from '../../../send/send.page';
import { NWConstants } from '../../../../models/constants';

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
    public wallet: NWAsset.Item;
    private subscriptions: Subscription[] = [];

    constructor(
        navCtrl: NavController,
        params: NavParams,
        parent: ModalNavPage,
        private logger: LoggerService,
        private account: AccountService,
        private event: EventService,
        private channel: ChannelService,
        private modal: ModalController
    ) {
        super(navCtrl, params, parent);
        this.wallet = params.get('wallet');
        this.init();
    }

    public isNCN(): boolean {
        return this.wallet.getCurrencyId() === NWConstants.NCN.currencyId;
    }

    public classAmount(type: string): string {
        if (this.isNCN()) {
            return (['BUY', 'RECEIVE', 'LOAN'].indexOf(type) > -1) ? 'white' : 'red';
        } else {
            return (type === 'RECEIVE') ? 'white' : 'red';
        }
    }

    private async init(): Promise<void> {
        this.account.registerSubjects(account => {
            this.subscriptions.push(account.assetTransactionsChanged(this.wallet.getWalletId(), this.arrange));
        });

        this.channel.getWalletTransactions(this.wallet.getWalletId(), 0, this.limit);
        const data = await this.channel.getWalletDetails(this.wallet.getWalletId());
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

        const a = this.wallet;
        this.wallet = undefined;
        this.wallet = a;
    };

    public async doInfinite(infinite: InfiniteScroll): Promise<void> {
        const transactions = await this.channel.getWalletTransactions(this.wallet.getWalletId(), this.skip, this.limit);
        if (transactions.length < 1) {
            this.logger.debug('[transfer-tab-page] response transfers length =', transactions.length);
            infinite.enable(false);
            return;
        }

        infinite.complete();
    }

    public onExploreTransaction(transaction: NWTransaction.Item): void {
        if (transaction.transactionType === 'SEND' || transaction.transactionType === 'RECEIVE') {
            this.navCtrl.push(WalletTransactionDetailPage, {
                transaction: transaction,
                wallet: this.wallet
            }, NWTransition.Slide('left'));
        }
    }

    public onClick_Receive(): void {
        this.event.publish(NWEvent.App.change_tab, { index: 0, currencyId: this.wallet.getCurrencyId() });
        this.parent.close();
    }

    public onClick_Send(): void {
        const page = this.modal.create(
            ModalNavPage,
            ModalNavPage.resolveModal(SendPage, param => {
                param.canBack = true;
                param.headerType = 'bar';
                param.selectedWallet = this.wallet;
            })
        );

        page.present();
    }
}
