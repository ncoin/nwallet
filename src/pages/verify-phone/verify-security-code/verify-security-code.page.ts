import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { LoggerService } from '../../../providers/common/logger/logger.service';
import { ModalNavPage } from '../../0.base/modal-nav.page';
import { EventService } from '../../../providers/common/event/event';
import { NWEvent } from '../../../interfaces/events';
import { NWalletAppService } from '../../../providers/app/app.service';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { AuthorizationService } from '../../../providers/nsus/authorization.service';

@IonicPage()
@Component({
    selector: 'page-verify-security-code',
    templateUrl: 'verify-security-code.page.html'
})
export class VerifySecuritycodePage {
    private previousView: ViewController;
    private countryCode: string;
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
        private app: NWalletAppService,
        private auth: AuthorizationService
    ) {
        this.previousView = this.navParams.get('viewCtrl');
        this.phoneNumber = this.navParams.get('phoneNumber');
        this.countryCode = this.navParams.get('countryCode');
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

    public async onClick_Next(): Promise<void> {
        this.isCountBegin = false;
        // todo auth success --sky
        const secureCode = this.securityCodes.reduce((p, n) => p + n);
        const result = this.auth.verifyMobileNumber(this.countryCode, this.phoneNumber, secureCode);
        if (result) {
            this.app.enter(`+${this.countryCode}-${this.phoneNumber}`);
            this.parent.close();
            this.orientation.unlock();
        }
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
