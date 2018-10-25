import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { LoggerService } from '../../../providers/common/logger/logger.service';
import { ModalNavPage } from '../../0.base/modal-nav.page';
import { EventService } from '../../../providers/common/event/event';
import { NWEvent } from '../../../interfaces/events';
import { NWalletAppService } from '../../../providers/app/app.service';

@IonicPage()
@Component({
    selector: 'page-verify-security-code',
    templateUrl: 'verify-security-code.page.html'
})
export class VerifySecuritycodePage {
    private previousView: ViewController;
    private isCountBegin: boolean;
    public securityCodes = [];
    public phoneNumber: string;
    public expiredTimeSpan: number;

    constructor(private navCtrl: NavController, private navParams: NavParams, private logger: LoggerService, private parent: ModalNavPage, private app: NWalletAppService) {
        this.previousView = this.navParams.get('viewCtrl');
        this.phoneNumber = this.navParams.get('phoneNumber');
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
        // todo auth success --sky
        this.app.enter(this.phoneNumber);
        this.parent.close();
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
