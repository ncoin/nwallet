import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { LoggerService } from '../../providers/common/logger/logger.service';
import { ModalPageBase } from '../0.base/modal.page';

// todo [important] Guard impl!!
@IonicPage()
@Component({
    selector: 'page-verify-phone',
    templateUrl: 'verify-phone.page.html'
})
export class VerifyPhonePage  {
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private toast: ToastController,
        private viewCtrl: ViewController,
        private qrScanner: QRScanner,
        protected logger: LoggerService
    ) {
        this.init();
    }

    private init(): void {}
}
