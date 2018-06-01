import { PreferenceProvider, Preference } from './../../providers/common/preference/preference';
import { WalletPage } from './../wallet/wallet';
import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Logger } from '../../providers/common/logger/logger';
import { AccountProvider } from '../../providers/account/account';
import { NWallet } from '../../interfaces/nwallet';

/**
 * Generated class for the ImportaccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-importaccount',
    templateUrl: 'importaccount.html',
})
export class ImportAccountPage {
    public secretKey: string;

    constructor(public navCtrl: NavController, public account: AccountProvider, private preference: PreferenceProvider, private logger: Logger) {}

    ionViewDidLoad() {}

    public async onImportAccount(): Promise<void> {
        this.logger.debug('import ', this.secretKey);
        const signature = this.account.generateSignature(this.secretKey);

        await this.preference.set(Preference.Nwallet.walletAccount, <NWallet.Account>{
            isActivate: false,
            signature: signature,
            address: NWallet.AddressEmpty,
            profile: NWallet.ProfileEmpty,
            wallets: NWallet.WalletEmpty,
        });

        setTimeout(async () => {
            const current = this.navCtrl.getActive();
            await this.navCtrl.push(WalletPage, undefined, undefined, async () => {
                await this.navCtrl.removeView(current);
            });
        }, 1000);
    }
}
