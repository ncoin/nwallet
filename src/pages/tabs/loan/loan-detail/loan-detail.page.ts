import { Component } from '@angular/core';
import { NavController, ModalController, LoadingController, Loading, IonicPage, InfiniteScroll } from 'ionic-angular';
import _ from 'lodash';
import { NWAsset, NWTransaction } from '../../../../models/nwallet';
import { LoggerService } from '../../../../services/common/logger/logger.service';
import { NWalletAppService } from '../../../../services/app/app.service';
import { AccountService } from '../../../../services/account/account.service';
import { CurrencyService } from '../../../../services/nwallet/currency.service';
import { Asset } from '../../../../models/api/response';
import { SlideHelper } from '../../../../tools/helper/slide.helper';
import { Subscription } from 'rxjs/Subscription';
import { ChannelService } from '../../../../services/nwallet/channel.service';
import { ModalBasePage } from '../../../base/modal.page';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { ModalNavPage } from '../../../base/modal-nav.page';
import { WalletTransactionDetailPage } from '../../wallet-main/wallet-detail/wallet-transaction-detail.page';
import { NWTransition } from '../../../../tools/extension/transition';
import { LoanFormPage } from './loan-form/loan-form.page';

export interface LoanSlide {
    items: NWAsset.Item[];
}

@IonicPage()
@Component({
    selector: 'page-loan-detail',
    templateUrl: 'loan-detail.page.html'
})
export class LoanDetailPage extends ModalBasePage {
    public wallet: NWAsset.Item;
    public transactionMaps: Array<{ date: string; transactions: NWTransaction.Item[]; time: number }> = new Array<{
        date: string;
        transactions: NWTransaction.Item[];
        time: number;
    }>();

    private subscriptions: Subscription[] = [];
    private skip = 0;
    private limit = 10;
    constructor(
        navCtrl: NavController,
        params: NavParams,
        parent: ModalNavPage,
        private logger: LoggerService,
        private app: NWalletAppService,
        private account: AccountService,
        private channel: ChannelService,
        private currency: CurrencyService
    ) {
        super(navCtrl, params, parent);
        this.wallet = params.get('wallet');
    }

    public onColleteralChanged() {}

    async ionViewDidEnter() {
        this.account.registerSubjects(account => this.subscriptions.push(account.assetTransactionsChanged(this.wallet.getWalletId(), this.arrange())));
        this.channel.getWalletTransactions(this.wallet.getWalletId(), 0, this.limit);
        const data = await this.channel.getWalletDetails(this.wallet.getWalletId());
    }

    ionViewDidLeave() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    private arrange() {
        return (transactions: NWTransaction.Item[]) => {
            if (transactions.length < 1) {
                return;
            }

            const transactionGroups = _.groupBy(transactions, (t: NWTransaction.Item) => t.groupDate);

            // fixme --sky`
            // todo loaned & repay filter
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
        };
    }

    public async doInfinite(infinite: InfiniteScroll): Promise<void> {
        const transactions = await this.channel.getWalletTransactions(this.wallet.getWalletId(), this.skip, this.limit);
        if (transactions.length < 1) {
            this.logger.debug('[loan-detail-page] response transfers length =', transactions.length);
            infinite.enable(false);
            return;
        }

        infinite.complete();
    }

    public onExploreTransaction(transaction: NWTransaction.Item): void {
        this.navCtrl.push(WalletTransactionDetailPage, { transaction: transaction }, NWTransition.Slide('left'));
    }

    public onClick_Loan(): void {
        this.navCtrl.push(LoanFormPage, { wallet: this.wallet });
    }

    public onClick_Repay(): void {}
}
