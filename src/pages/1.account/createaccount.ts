import { PreferenceProvider } from './../../providers/common/preference/preference';
import { AccountProvider } from './../../providers/account/account';
import { WalletPage } from './../wallet/wallet';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Logger } from '../../providers/common/logger/logger';
import { Preference } from '../../providers/common/preference/preference';
import { NWallet } from '../../interfaces/nwallet';

/**
 * Generated class for the CreateaccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-createaccount',
    templateUrl: 'createaccount.html',
})
export class CreateAccountPage {
    constructor(public navCtrl: NavController, private account: AccountProvider, private preference: PreferenceProvider, private logger: Logger) {}

    async ionViewDidLoad() {

        const signature = this.account.generateSignature();
        this.logger.debug('generated account', signature);
        await this.preference.set(Preference.Nwallet.walletAccount, <NWallet.Account>{
            isActivate: false,
            signature: signature,
            address: undefined,
            profile: undefined,
            wallets: undefined,
        });

        setTimeout(async () => {
            await this.navCtrl.setRoot(WalletPage, undefined, undefined);
        }, 1000);
    }
}
