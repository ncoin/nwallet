import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams } from 'ionic-angular';
import { NWAsset } from '../../../../../models/nwallet';
import { Subscription } from 'rxjs';
import { ModalNavPage } from '../../../../base/modal-nav.page';
import { LoggerService } from '../../../../../services/common/logger/logger.service';
import { NWalletAppService } from '../../../../../services/app/app.service';
import { AccountService } from '../../../../../services/account/account.service';
import { ChannelService } from '../../../../../services/nwallet/channel.service';
import { CurrencyService } from '../../../../../services/nwallet/currency.service';

@IonicPage()
@Component({
    selector: 'page-loan-form',
    templateUrl: 'loan-form.page.html'
})
export class LoanFormPage {
    public wallet: NWAsset.Item;
    private subscriptions: Subscription[] = [];

    public isTermAgreed = false;
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

    public onColleteralChanged() {}

    async ionViewDidEnter() {
        const data = await this.channel.getWalletDetails(this.wallet.getWalletId());
    }

    ionViewDidLeave() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    public onClick_Loan(): void {}
}
