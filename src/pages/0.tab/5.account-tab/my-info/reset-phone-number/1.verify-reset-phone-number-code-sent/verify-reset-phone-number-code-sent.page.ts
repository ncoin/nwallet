import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, LoadingController } from 'ionic-angular';
import { ModalBasePage } from '../../../../../0.base/modal.page';
import { ModalNavPage } from '../../../../../0.base/modal-nav.page';
import { LoggerService } from '../../../../../../providers/common/logger/logger.service';
import { InternationalPhoneComponent } from '../../../../../../components/popovers/international-phone/international-phone';
import { NsusChannelService } from '../../../../../../providers/nsus/nsus-channel.service';
import { VerifyResetPhoneNumberSecuritycodePage } from '../2.verify-reset-phone-number-security-code/verify-reset-phone-number-security-code.page';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { AuthorizationService } from '../../../../../../providers/auth/authorization.service';

// todo [important] Guard impl!!
@IonicPage()
@Component({
    selector: 'page-verify-reset-phone-number-code-sent',
    templateUrl: 'verify-reset-phone-number-code-sent.page.html'
})
export class VerifyResetPhoneNumberCodeSentPage  {
    public countryCode = '';
    public phoneNumber = '';
    public selectedCountry: { country: string; code: string };

    constructor(
        private navCtrl: NavController,
        private navParams: NavParams,
        private viewCtrl: ViewController,
        protected logger: LoggerService,
        private auth: AuthorizationService
    ) {
        this.phoneNumber = this.navParams.get('phoneNumber');
        this.logger.debug('[verify-reset-phone-number-code-sent-page] phoneNumber : ', this.phoneNumber);
    }

    public ionViewCanEnter(): Promise<boolean> {
        this.logger.debug('[verify-reset-phone-number-code-sent-page] request security code : ', this.phoneNumber);
        return this.auth.verifyResetMobileNumber(this.phoneNumber);
    }

    public ionViewDidLoad() {
        setTimeout(() => {
        this.logger.debug('[verify-reset-phone-number-code-sent-page] ionViewDidLoad - phoneNumber : ', this.phoneNumber);
            this.navCtrl.push(VerifyResetPhoneNumberSecuritycodePage, { viewCtrl: this.viewCtrl, phoneNumber: this.phoneNumber });
        }, 1000);
    }
}


