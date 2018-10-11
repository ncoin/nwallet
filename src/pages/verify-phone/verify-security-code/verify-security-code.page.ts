import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, PopoverController } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { LoggerService } from '../../../providers/common/logger/logger.service';
import { NsusChannelService } from '../../../providers/nsus/nsus-channel.service';
import { Observable } from 'rxjs';

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

    constructor(private navCtrl: NavController, private navParams: NavParams, private logger: LoggerService, private channel: NsusChannelService) {
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
