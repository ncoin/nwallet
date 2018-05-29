import { AppServiceProvider } from './../../providers/app/app.service';
import { Logger } from './../../providers/common/logger/logger';
import { EntrancePage } from './../0.entrance/entrance';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NWallet } from '../../interfaces/nwallet';
import { AccountProvider } from '../../providers/account/account';

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

    account: NWallet.Account = <NWallet.Account> {
        signature : { public : '', secret: ''},
        wallets : [{ asset : { code: ' ' }, amount : ' ' }]
    }

    destination: string;
    amount: string;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private logger: Logger,
        private accountProvider: AccountProvider,
        private appService: AppServiceProvider
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

    public onClick(): void {
        this.navCtrl.setRoot(EntrancePage, undefined, {
            animate: true,
            animation: 'wp-transition',
        });
        this.logger.debug('onClick');
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
        this.appService.sendPayment(this.account.signature, this.destination, this.account.wallets[1], this.amount);
    }
}
