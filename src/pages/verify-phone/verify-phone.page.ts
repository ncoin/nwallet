import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoggerService } from '../../providers/common/logger/logger.service';
import { ModalBasePage } from '../0.base/modal.page';
import { ModalNavPage } from '../0.base/modal-nav.page';
import { LocaleService, CountryService } from 'ng4-intl-phone';
import { InternationalPhoneComponent } from '../../components/popovers/international-phone/international-phone';
import { VerifySuccessPage } from './verify-success/verify-success.page';
import { VerifySecuritycodePage } from './verify-security-code/verify-security-code.page';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { PlatformService } from '../../providers/common/platform/platform.service';
import { AppConfigService } from '../../providers/app/app.config.service';
import { PopupService } from '../../providers/popup/popop.service';
import { TitleCasePipe } from '@angular/common';

// todo [important] Guard impl!!
@IonicPage()
@Component({
    selector: 'page-verify-phone',
    templateUrl: 'verify-phone.page.html'
})
export class VerifyPhonePage extends ModalBasePage {
    public countryCode = '';
    public phoneNumber = '';
    public selectedCountry: { fullName: string; countryCode: string; dialCode: string };

    constructor(
        navCtrl: NavController,
        navParams: NavParams,
        parent: ModalNavPage,
        private popup: PopupService,
        protected logger: LoggerService,
        private platform: PlatformService,
        private locale: LocaleService,
        private appConfig: AppConfigService,
        private country: CountryService
    ) {
        super(navCtrl, navParams, parent);
        this.init();
    }

    // todo fixme
    private async init() {
        this.platform.orientation.lock(this.platform.orientation.ORIENTATIONS.LANDSCAPE_PRIMARY);
        const locale = await this.appConfig.getLocale();

        // countryCode: "tl"
        // dialCode: "670"
        // name: ""
        const countries = this.country.getCountries();
        const target = countries.find(c => c.countryCode === locale.country);
        target.name = new TitleCasePipe().transform(this.locale.getLocales(locale.language)[target.countryCode]);

        this.logger.debug('[verify-phone] remommended country :', target);

        this.selectedCountry = {
            fullName: new TitleCasePipe().transform(target.name),
            countryCode: target.countryCode,
            dialCode: target.dialCode
        };
    }

    public onInput(input: any): void {
        if (input === 'delete') {
            this.phoneNumber = this.phoneNumber.substring(0, this.phoneNumber.length - 1);
        } else {
            this.phoneNumber = this.phoneNumber + input;
        }
    }

    public async onCountryChanged(event: any): Promise<void> {
        const country = await this.popup.selectCountry(this.selectedCountry.countryCode);
        this.logger.debug('[verify-phone-page] selected country', country);
        if (country) {
            this.selectedCountry = {
                fullName: country.fullName,
                countryCode: country.code,
                dialCode: country.dialCode
            };
        }
    }

    public async onClick_Next(): Promise<void> {
        this.logger.debug('[verify-phone-page] phoneNumber : ', this.phoneNumber);

        await this.navCtrl.push(VerifySuccessPage, {
            countryCode: this.selectedCountry.dialCode,
            phoneNumber: this.phoneNumber
        });
    }
}

export const VERIFY_PHONE_PAGES = [VerifyPhonePage, VerifySuccessPage, VerifySecuritycodePage];
