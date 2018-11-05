import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import { LoggerService } from '../../../providers/common/logger/logger.service';
import { NsusChannelService } from '../../../providers/nsus/nsus-channel.service';
import { VerifySecuritycodePage } from '../verify-security-code/verify-security-code.page';

// todo [important] Guard impl!!
@IonicPage()
@Component({
    selector: 'page-verify-success',
    templateUrl: 'verify-success.page.html'
})
export class VerifySuccessPage {
    private phoneNumber: string;
    constructor(
        private navCtrl: NavController,
        private navParams: NavParams,
        private logger: LoggerService,
        private channel: NsusChannelService,
        private viewCtrl: ViewController
    ) {
        this.phoneNumber = this.navParams.get('phoneNumber');
        this.logger.debug('[verify-success-page] constructor - phoneNumber : ', this.phoneNumber);
    }

    public ionViewCanEnter(): Promise<boolean> {
        this.logger.debug('[verify-success-page] ionViewCanEnter - phoneNumber : ', this.phoneNumber);

        return this.channel.requestPhoneVerification(this.phoneNumber);
    }

    public ionViewDidLoad() {
        setTimeout(() => {
        this.logger.debug('[verify-success-page] ionViewDidLoad - phoneNumber : ', this.phoneNumber);
            this.navCtrl.push(VerifySecuritycodePage, { viewCtrl: this.viewCtrl, phoneNumber: this.phoneNumber });
        }, 1000);
    }
}
