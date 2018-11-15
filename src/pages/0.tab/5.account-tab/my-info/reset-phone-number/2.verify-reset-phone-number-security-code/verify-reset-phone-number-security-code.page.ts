import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { LoggerService } from '../../../../../../providers/common/logger/logger.service';
import { ModalNavPage } from '../../../../../base/modal-nav.page';
import { NWalletAppService } from '../../../../../../providers/app/app.service';
import { VerfiyResetPhoneNumberSuccessPage } from '../3.verfy-reset-phone-number-success/verify-reset-phone-number-success.page';

@IonicPage()
@Component({
    selector: 'page-verify-reset-phone-number-security-code',
    templateUrl: 'verify-reset-phone-number-security-code.page.html'
})
export class VerifyResetPhoneNumberSecuritycodePage {
    private previousView: ViewController;
    private isCountBegin: boolean;
    public securityCodes = [];
    public phoneNumber: string;
    public expiredTimeSpan: number;

    constructor(
        private navCtrl: NavController,
        private navParams: NavParams,
        private orientation: ScreenOrientation,
        private logger: LoggerService,
        private parent: ModalNavPage,
        private app: NWalletAppService
    ) {
        this.previousView = this.navParams.get('viewCtrl');
        this.phoneNumber = this.navParams.get('phoneNumber');
        // this.phoneNumber = '11111111111111';
        this.expiredTimeSpan = 60 * 3 * 1000;
    }

    ionViewDidLoad() {
        this.navCtrl.removeView(this.previousView);
        this.isCountBegin = true;
        this.beginTimeCount();
    }

    ionViewDidLeave() {
        this.isCountBegin = false;
    }

    // todo change me --sky`
    private beginTimeCount(): void {
        if (!this.isCountBegin) {
            return;
        }

        setTimeout(() => {
            this.expiredTimeSpan -= 1000;
            this.beginTimeCount();
        }, 1000);
    }

    public onClick_Next(): void {
        this.isCountBegin = false;
        this.navCtrl.push(VerfiyResetPhoneNumberSuccessPage);
    }

    public onInput(input: any): void {
        if (input === 'delete') {
            this.securityCodes.pop();
            return;
        }

        if (this.securityCodes.length > 6) {
            return;
        }

        this.securityCodes.push(input);
    }
}
