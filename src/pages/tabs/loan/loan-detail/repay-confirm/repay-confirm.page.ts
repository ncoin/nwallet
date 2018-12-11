import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Component } from '@angular/core';

import { NWAsset, NWTransaction } from '../../../../../models/nwallet';

import { Subscription } from 'rxjs';

import { ModalNavPage } from '../../../../base/modal-nav.page';

import { LoggerService } from '../../../../../services/common/logger/logger.service';

import { NWalletAppService } from '../../../../../services/app/app.service';

import { AccountService } from '../../../../../services/account/account.service';

import { ChannelService } from '../../../../../services/nwallet/channel.service';

import { CurrencyService } from '../../../../../services/nwallet/currency.service';

@IonicPage()
@Component({
    selector: 'page-repay-confirm',
    templateUrl: 'repay-confirm.page.html'
})
export class RepayConfirmPage {
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
        this.wallet = params.get('wallet');
    }

    public onCollateralChanged() {}

    async ionViewDidEnter() {
        // this.account.registerSubjects(account => this.subscriptions.push(account.assetTransactionsChanged(this.wallet.getWalletId(), this.arrange())));
        this.channel.getWalletTransactions(this.wallet.getWalletId(), 0, this.limit);
        const data = await this.channel.getWalletDetails(this.wallet.getWalletId());
    }

    ionViewDidLeave() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }
}
