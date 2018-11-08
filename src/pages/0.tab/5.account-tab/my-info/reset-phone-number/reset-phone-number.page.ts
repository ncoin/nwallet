import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, AlertController } from 'ionic-angular';
import { ModalBasePage } from '../../../../0.base/modal.page';
import { ModalNavPage } from '../../../../0.base/modal-nav.page';
import { LoggerService } from '../../../../../providers/common/logger/logger.service';
import { VerifyResetPhoneNumberCodeSentPage } from './1.verify-reset-phone-number-code-sent/verify-reset-phone-number-code-sent.page';
import { VerifyResetPhoneNumberSecuritycodePage } from './2.verify-reset-phone-number-security-code/verify-reset-phone-number-security-code.page';
import { VerfiyResetPhoneNumberSuccessPage } from './3.verfy-reset-phone-number-success/verify-reset-phone-number-success.page';
import { PlatformService } from '../../../../../providers/common/platform/platform.service';
import { AccountService } from '../../../../../providers/account/account.service';
import { AppConfigService } from '../../../../../providers/app/app.config.service';
import { CountryService, LocaleService } from 'ng4-intl-phone';
import { TitleCasePipe } from '@angular/common';
import { PopupService } from '../../../../../providers/popup/popop.service';

// todo [important] Guard impl!!
@IonicPage()
@Component({
    selector: 'page-reset-phone-number',
    templateUrl: 'reset-phone-number.page.html'
})
export class ResetPhoneNumberPage extends ModalBasePage implements OnDestroy {
    public countryCode = '';
    public newPhoneNumber = '';
    public currentPhoneNumber = '';
    public selectedCountry: { name: string; country: string; code: string };

    constructor(
        navCtrl: NavController,
        navParams: NavParams,
        parent: ModalNavPage,
        private alert: AlertController,
        private logger: LoggerService,
        private account: AccountService,
        private platform: PlatformService,
        private appConfig: AppConfigService,
        private country: CountryService,
        private locale: LocaleService,
        private popup: PopupService
    ) {
        super(navCtrl, navParams, parent);
        this.platform.orientation.lock(this.platform.orientation.ORIENTATIONS.LANDSCAPE_PRIMARY);
        this.init();
    }

    private async init() {
        const account = await this.account.detail();
        this.currentPhoneNumber = account.getUserName();

        const locale = await this.appConfig.getLocale();

        // countryCode: "tl"
        // dialCode: "670"
        // name: ""
        const countries = this.country.getCountries();
        const targetCountry = countries.find(c => c.countryCode === locale.country);

        this.logger.debug('[verify-phone] recommended country :', targetCountry);

        this.selectedCountry = {
            name: this.locale.getLocales(locale.language)[targetCountry.countryCode],
            country: targetCountry.countryCode,
            code: targetCountry.dialCode
        };
    }

    ngOnDestroy(): void {
        this.platform.orientation.unlock();
    }

    public onInput(input: any): void {
        if (input === 'delete') {
            this.newPhoneNumber = this.newPhoneNumber.substring(0, this.newPhoneNumber.length - 1);
        } else {
            this.newPhoneNumber = this.newPhoneNumber + input;
        }
    }

    public async onCountryChanged(event: any): Promise<void> {
        const task = await this.popup.countryAlert();
        if (task) {
            this.selectedCountry = {
                name: task.fullName,
                code: task.dialCode,
                country: task.code
            };
        }
    }

    public async onClick_Next(): Promise<void> {
        this.logger.debug('[verify-phone-page] phoneNumber : ', this.newPhoneNumber);

        await this.navCtrl.push(VerifyResetPhoneNumberCodeSentPage, {
            phoneNumber: this.selectedCountry.code + this.newPhoneNumber
        });
    }
}

export const RESET_PHONE_NUMBER_COMPONENTS = [ResetPhoneNumberPage, VerifyResetPhoneNumberCodeSentPage, VerifyResetPhoneNumberSecuritycodePage, VerfiyResetPhoneNumberSuccessPage];
