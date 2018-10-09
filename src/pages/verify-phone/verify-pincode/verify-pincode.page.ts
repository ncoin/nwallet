import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, PopoverController } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { LoggerService } from '../../../providers/common/logger/logger.service';
import { NsusChannelService } from '../../../providers/nsus/nsus-channel.service';

@IonicPage()
@Component({
    selector: 'page-verify-pincode',
    templateUrl: 'verify-pincode.page.html'
})
export class VerifyPincodePage {
    public pinCode = [];
    private previousView: ViewController;
    constructor(private navCtrl: NavController, private navParams: NavParams, private logger: LoggerService, private channel: NsusChannelService) {
        this.previousView = this.navParams.get('viewCtrl');
    }

    ionViewDidLoad() {
        this.navCtrl.removeView(this.previousView);
    }

    public onInput(input: any): void {
        if (input === 'delete') {
            this.pinCode.pop();
            return;
        }

        if (this.pinCode.length > 6) {
            return;
        }

        this.pinCode.push(input);
    }
}
