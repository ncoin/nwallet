import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, PopoverController, LoadingController } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { LoggerService } from '../../providers/common/logger/logger.service';
import { ModalBasePage } from '../0.base/modal.page';
import { ModalNavPage } from '../0.base/modal-nav.page';
import { LocaleService, CountryService } from 'ng4-intl-phone';
import { InternationalPhoneComponent } from '../../components/popovers/international-phone/international-phone';
import { VerifySuccessPage } from './verify-success/verify-success.page';
import { VerifySecuritycodePage } from './verify-security-code/verify-security-code.page';

// todo [important] Guard impl!!
@IonicPage()
@Component({
    selector: 'page-verify-phone',
    templateUrl: 'verify-phone.page.html'
})
export class VerifyPhonePage extends ModalBasePage {
    public countryCode = '';
    public phoneNumber = '';
    public selectedCountry: { country: string; code: string };

    constructor(
        navCtrl: NavController,
        navParams: NavParams,
        parent: ModalNavPage,
        private popover: PopoverController,
        protected logger: LoggerService,
        private loading: LoadingController
    ) {
        super(navCtrl, navParams, parent);
    }

    public onInput(input: any): void {
        if (input === 'delete') {
            this.phoneNumber = this.phoneNumber.substring(0, this.phoneNumber.length - 1);
        } else {
            this.phoneNumber = this.phoneNumber + input;
        }
    }

    public async onCountryChanged(event: any): Promise<void> {
        const popover = this.popover.create(InternationalPhoneComponent);
        popover.onDidDismiss((data, role) => {
            if (data) {
                this.selectedCountry = data;
            }
        });
        await popover.present({
            ev: event
        });
    }

    public async onClick_Next(): Promise<void> {
        // const loading = this.loading.create({
        //     duration : 1000
        // });
        // loading.present();
        this.logger.debug('[verify-phone-page] phoneNumber : ', this.phoneNumber);

        const result = await this.navCtrl.push(VerifySuccessPage, {
            phoneNumber : this.selectedCountry.code + this.phoneNumber,
        });
        // loading.dismiss();
        this.logger.debug('result', result);
    }
    private init(): void {}
}

export const VERIFY_PHONE_PAGES = [VerifyPhonePage, VerifySuccessPage, VerifySecuritycodePage];
