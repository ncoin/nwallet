import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, PopoverController } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { LoggerService } from '../../../providers/common/logger/logger.service';
import { ModalBasePage } from '../../0.base/modal.page';
import { ModalNavPage } from '../../0.base/modal-nav.page';
import { LocaleService, CountryService } from 'ng4-intl-phone';
import { InternationalPhoneComponent } from '../../../components/popovers/international-phone/international-phone';
import { NWalletAppService } from '../../../providers/app/app.service';
import { NsusChannelService } from '../../../providers/nsus/nsus-channel.service';
import { VerifyPincodePage } from '../verify-pincode/verify-pincode.page';

// todo [important] Guard impl!!
@IonicPage()
@Component({
    selector: 'page-verify-success',
    templateUrl: 'verify-success.page.html'
})
export class VerifySuccessPage {
    constructor(
        private navCtrl: NavController,
        private navParams: NavParams,
        private logger: LoggerService,
        private channel: NsusChannelService,
        private viewCtrl: ViewController
    ) {}

    public ionViewCanEnter(): Promise<boolean> {
        return this.channel.requestPhoneVerification();
    }

    public ionViewDidLoad() {
        setTimeout(() => {
            this.navCtrl.push(VerifyPincodePage, { viewCtrl: this.viewCtrl });
        }, 1000);
    }
}
