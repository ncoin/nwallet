import { PreferenceProvider } from '../../providers/common/preference/preference';
import { AppServiceProvider } from '../../providers/app/app.service';
import { AccountService } from '../../providers/account/account.service';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoggerService } from '../../providers/common/logger/logger.service';
import { Preference } from '../../providers/common/preference/preference';
import { NWallet } from '../../interfaces/nwallet';
import { TabcontainerPage } from '../0.tab/0.container/tabcontainer';

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
    public secretKey: string;

    constructor(
        public navCtrl: NavController,
        private account: AccountService,
        private preference: PreferenceProvider,
        private logger: LoggerService,
        private appService: AppServiceProvider
    ) {
        this.secretKey = 'SCADDA4KG2PE2LIWNI6KP3YALEXJP2IO273DFGCH3RCCYH3JABTTIG5U';
    }

    ionViewDidLoad() {
        const signature = this.account.generateSignature(this.secretKey);
        this.logger.debug('generated account', signature);
        const importAccount = <NWallet.Account>{
            isActivate: false,
            signature: signature,
            address: undefined,
            profile: undefined,
            wallets: [],
        };

        this.appService.login(importAccount);

        /*

        setTimeout(async () => {
            await this.appService.login(importAccount);
        }, 1000);
        */
        /*
        await this.preference.set(Preference.Nwallet.walletAccount, <NWallet.Account>{
            isActivate: false,
            signature: signature,
            address: undefined,
            profile: undefined,
            wallets: undefined,
        });

        setTimeout(async () => {
            await this.navCtrl.setRoot(TabcontainerPage, undefined, undefined);
        }, 1000);
        */
    }
}
