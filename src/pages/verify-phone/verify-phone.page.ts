import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { LoggerService } from '../../providers/common/logger/logger.service';
import { ModalBasePage } from '../0.base/modal.page';
import { ModalNavPage } from '../0.base/modal-nav.page';

// todo [important] Guard impl!!
@IonicPage()
@Component({
    selector: 'page-verify-phone',
    templateUrl: 'verify-phone.page.html',
})
export class VerifyPhonePage extends ModalBasePage {
    public phoneNumber: string;
    constructor(
        navCtrl: NavController,
        navParams: NavParams,
        parent: ModalNavPage,
        protected logger: LoggerService
    ) {
        super(navCtrl, navParams, parent);
        this.canBack = false;
        this.init();
    }

    private init(): void {}
}
