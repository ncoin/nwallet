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
    templateUrl: 'verify-phone.page.html'
})
export class VerifyPhonePage extends ModalBasePage {
    public phoneNumber = '';
    public countries = [
        {
            country: 'ko',
            code: '82'
        },
        {
            country: 'ko2',
            code: '822'
        }
    ];

    public selectedCountry: { country: string; code: string } = { country: 'de', code: '23' };

    constructor(navCtrl: NavController, navParams: NavParams, parent: ModalNavPage, protected logger: LoggerService) {
        super(navCtrl, navParams, parent);
        console.log(this.params);
    }

    public onInput(input: any): void {
        if (input === 'delete') {
            this.phoneNumber = this.phoneNumber.substring(0, this.phoneNumber.length - 1);
        } else {
            this.phoneNumber = this.phoneNumber + input;
        }
    }
    private init(): void {}
}
