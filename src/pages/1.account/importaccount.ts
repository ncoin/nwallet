import { NWalletAppService } from '../../providers/app/app.service';
import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { LoggerService } from '../../providers/common/logger/logger.service';
import { AccountService } from '../../providers/account/account.service';
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

    constructor(
        public navCtrl: NavController,
        public account: AccountService,
        private logger: LoggerService,
        private appService: NWalletAppService,
    ) {}

    ionViewDidLoad() {
        this.secretKey = 'SBYL6P3XWV3XPB7Y7NVFCKCGF32IP4WT5YTIIAMTVGVFND53ECVE4TIR';
    }

    public async onImportAccount(): Promise<void> {
        this.logger.debug('[import-account-page] import', this.secretKey);
        const signature = this.account.generateSignature(this.secretKey);

        const importAccount = <NWallet.Account>{
            isActivate: false,
            signature: signature,
            address: undefined,
            profile: undefined,
            wallets: [],
        };

        await this.appService.login(importAccount);
    }
}
