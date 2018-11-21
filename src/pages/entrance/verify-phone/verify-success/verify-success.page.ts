import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { LoggerService } from '../../../../services/common/logger/logger.service';
import { VerifySecuritycodePage } from '../verify-security-code/verify-security-code.page';
import { AuthorizationService } from '../../../../services/nsus/authorization.service';

// todo [important] Guard impl!!
@IonicPage()
@Component({
    selector: 'page-verify-success',
    templateUrl: 'verify-success.page.html'
})
export class VerifySuccessPage {
    private phoneNumber: string;
    private countryCode: string;
    constructor(private navCtrl: NavController, private navParams: NavParams, private logger: LoggerService, private auth: AuthorizationService, private viewCtrl: ViewController) {
        this.phoneNumber = this.navParams.get('phoneNumber');
        this.countryCode = this.navParams.get('countryCode');
    }

    public async ionViewCanEnter(): Promise<boolean> {
        return this.auth.authMobileNumber(this.countryCode, this.phoneNumber);
    }

    public ionViewDidLoad() {
        setTimeout(() => {
            this.logger.debug('[verify-success-page] ionViewDidLoad - phoneNumber : ', this.phoneNumber);
            this.navCtrl.push(VerifySecuritycodePage, { viewCtrl: this.viewCtrl, phoneNumber: this.phoneNumber, countryCode: this.countryCode });
        }, 1000);
    }
}
