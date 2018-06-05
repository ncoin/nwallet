import { Asset } from 'stellar-sdk';
import { AppServiceProvider } from './../../providers/app/app.service';
import { Logger } from './../../providers/common/logger/logger';
import { EntrancePage } from './../0.entrance/entrance';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NWallet } from '../../interfaces/nwallet';
import { AccountProvider } from '../../providers/account/account';
import { WalletDetailPage } from '../wallet-detail/wallet-detail';

/**
 * Generated class for the WalletPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-wallet',
    templateUrl: 'wallet.html',
})
export class WalletPage {
    account: NWallet.Account = <NWallet.Account>{
        signature: { public: '', secret: '' },
        wallets: NWallet.WalletEmpty,
    };

    asset: Asset = Asset.native();
    destination: string;
    amount: string;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private logger: Logger,
        private accountProvider: AccountProvider,
        private appService: AppServiceProvider,
    ) {
        this.init();
    }

    private async init(): Promise<void> {
        this.account = await this.accountProvider.getAccount();
        await this.appService.login(this.account);
    }

    ionViewDidLoad() {
        this.logger.debug('ionViewDidLoad WalletPage');
        this.navCtrl.getActive().showBackButton(false);
    }

    public onSelectWallet(wallet: NWallet.WalletItem) {
        this.asset = wallet.asset;
        this.navCtrl.push(WalletDetailPage, { wallet: wallet}, {
            animate : true,
            animation : 'ios-transition'
        });
    }

    public onClear(): void {
        this.navCtrl.setRoot(EntrancePage, undefined, {
            animate: true,
            animation: 'ios-transition',
        });
        this.logger.debug('onClear');
    }

    public onLogout(): void {
        this.appService.logout(this.account);
        this.navCtrl.setRoot(EntrancePage, undefined, {
            animate: true,
            animation: 'ios-transition',
        });
    }

    public onSendPayment(): void {
        this.appService.sendPayment(this.account.signature, this.destination, this.asset, this.amount);
    }
}
