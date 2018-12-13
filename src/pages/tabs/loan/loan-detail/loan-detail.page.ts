import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController, IonicPage, InfiniteScroll } from 'ionic-angular';
import _ from 'lodash';
import { NWAsset, NWTransaction } from '../../../../models/nwallet';
import { LoggerService } from '../../../../services/common/logger/logger.service';
import { Subscription } from 'rxjs/Subscription';
import { ChannelService } from '../../../../services/nwallet/channel.service';
import { ModalBasePage } from '../../../base/modal.page';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { ModalNavPage } from '../../../base/modal-nav.page';
import { WalletTransactionDetailPage } from '../../wallet-main/wallet-detail/wallet-transaction-detail.page';
import { NWTransition } from '../../../../tools/extension/transition';
import { LoanFormPage } from './loan-form/loan-form.page';
import { RepayFormPage } from './repay-form/repay-form.page';
import { AccountService } from '../../../../services/account/account.service';

export interface LoanSlide {
    items: NWAsset.Item[];
}

@IonicPage()
@Component({
    selector: 'page-loan-detail',
    templateUrl: 'loan-detail.page.html'
})
export class LoanDetailPage extends ModalBasePage implements OnDestroy, OnInit {
    public wallet: NWAsset.Item;
    public transactionMaps: { date: string; transactions: NWTransaction.Collateral[]; time: number }[] = new Array<{
        date: string;
        transactions: NWTransaction.Collateral[];
        time: number;
    }>();

    private subscriptions: Subscription[] = [];
    private skip = 0;
    private limit = 10;
    constructor(navCtrl: NavController, params: NavParams, parent: ModalNavPage, private logger: LoggerService, private account: AccountService, private channel: ChannelService) {
        super(navCtrl, params, parent);
        this.wallet = params.get('wallet');
    }

    async ngOnInit(): Promise<void> {
        this.account.registerSubjects(a => {
            this.subscriptions.push(
                a.assetChanged(assets => {
                    const target = assets.find(asset => asset.getCurrencyId() === this.wallet.getCurrencyId());
                    if (target) {
                        this.wallet = target;
                    }
                })
            );
            this.subscriptions.push(a.collateralTransactionsChanged(this.wallet.Collateral.id, this.arrange()));
        });
    }

    ionViewDidEnter() {
        this.channel.getCollateralTransactions(this.wallet.Collateral.Id, 0, this.limit);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    private arrange() {
        return (transactions: NWTransaction.Collateral[]): void => {
            if (transactions.length < 1) {
                return;
            }
            const transactionGroups = _.groupBy(transactions, (t: NWTransaction.Collateral) => t.GroupDate);

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
            this.skip += transactions.length;
        };
    }

    public async doInfinite(infinite: InfiniteScroll): Promise<void> {
        const transactions = await this.channel.getCollateralTransactions(this.wallet.Collateral.Id, this.skip, this.limit);
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

    public onClick_Repay(): void {
        this.navCtrl.push(RepayFormPage, { wallet: this.wallet });
    }
}
