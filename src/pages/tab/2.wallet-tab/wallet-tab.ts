import { WalletLoanPage } from './wallet-detail/wallet-loan/wallet-loan';
import { WalletBuyPage } from './wallet-detail/wallet-buy/wallet-buy';
import { EntrancePage } from './../../0.entrance/entrance';
import { WalletDetailPage } from './wallet-detail/wallet-detail';
import { TokenProvider } from './../../../providers/token/token';
import { AccountProvider } from './../../../providers/account/account';
import { Logger } from './../../../providers/common/logger/logger';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NWallet } from '../../../interfaces/nwallet';
import { AppServiceProvider } from '../../../providers/app/app.service';

/**
 * Generated class for the WalletPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'tab-wallet',
    templateUrl: 'wallet-tab.html',
})
export class WalletPage {
    account: NWallet.Account;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private logger: Logger,
        private accountProvider: AccountProvider,
        private appService: AppServiceProvider,
        private token: TokenProvider,
    ) {
        this.init();
    }

    private async init(): Promise<void> {
        this.account = await this.accountProvider.getAccount();
        await this.appService.login(this.account);
        const token = await this.token.getToken();
        this.logger.debug('[remove me]', token);
    }

    ionViewDidLoad() {
        this.navCtrl.getActive().showBackButton(false);
    }

    public onSelectWallet(wallet: NWallet.WalletContext) {
        this.navCtrl.push(
            WalletDetailPage,
            { wallet: wallet },
            {
                animate: true,
                animation: 'ios-transition',
            },
        );
    }

    public onLogout(): void {
        this.appService.logout(this.account);
        this.navCtrl.setRoot(EntrancePage, undefined, {
            animate: true,
            animation: 'ios-transition',
        });
    }
}

export const WalletTabPages = [WalletPage, WalletDetailPage, WalletBuyPage, WalletLoanPage];
