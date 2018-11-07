import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, LoadingController, AlertController } from 'ionic-angular';
import { ModalBasePage } from '../../../../0.base/modal.page';
import { ModalNavPage } from '../../../../0.base/modal-nav.page';
import { LoggerService } from '../../../../../providers/common/logger/logger.service';
import { InternationalPhoneComponent } from '../../../../../components/popovers/international-phone/international-phone';
import { VerifyResetPhoneNumberCodeSentPage } from './1.verify-reset-phone-number-code-sent/verify-reset-phone-number-code-sent.page';
import { VerifyResetPhoneNumberSecuritycodePage } from './2.verify-reset-phone-number-security-code/verify-reset-phone-number-security-code.page';
import { VerfiyResetPhoneNumberSuccessPage } from './3.verfy-reset-phone-number-success/verify-reset-phone-number-success.page';
import { PlatformService } from '../../../../../providers/common/platform/platform.service';
import { AccountService } from '../../../../../providers/account/account.service';
import { AppConfigService } from '../../../../../providers/app/app.config.service';
import { CountryService, LocaleService } from 'ng4-intl-phone';
import { TitleCasePipe } from '@angular/common';

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
    public selectedCountry: { country: string; code: string };

    constructor(
        navCtrl: NavController,
        navParams: NavParams,
        parent: ModalNavPage,
        private alert: AlertController,
        private popover: PopoverController,
        private logger: LoggerService,
        private account: AccountService,
        private platform: PlatformService,
        private appConfig: AppConfigService,
        private country: CountryService,
        private locale: LocaleService
    ) {
        super(navCtrl, navParams, parent);
        this.platform.orientation.lock(this.platform.orientation.ORIENTATIONS.LANDSCAPE_PRIMARY);
        this.init();
    }

    ngOnDestroy(): void {
        this.platform.orientation.unlock();
    }

    private async init() {
        const account = await this.account.detail();
        this.currentPhoneNumber = account.getUserName();

        const locale = await this.appConfig.getLocale();

        // countryCode: "tl"
        // dialCode: "670"
        // name: ""
        const countries = this.country.getCountries();
        const target = countries.find(c => c.countryCode === locale.country);

        this.logger.debug('[verify-phone] remommended country :', target);

        this.selectedCountry = {
            country: target.countryCode,
            code: target.dialCode
        };
    }

    public onInput(input: any): void {
        if (input === 'delete') {
            this.newPhoneNumber = this.newPhoneNumber.substring(0, this.newPhoneNumber.length - 1);
        } else {
            this.newPhoneNumber = this.newPhoneNumber + input;
        }
    }

    public async onCountryChanged(event: any): Promise<void> {
        const alert = this.alert.create({
            title: 'Country',
            cssClass: 'alert-base title-underline alert-radio-group button-center auto-stretch'
        });

        const locale = await this.appConfig.getLocale();
        const names = this.locale.getLocales(locale.language);
        const countries = this.country.getCountries().slice();
        countries.sort((c1, c2) => {
            return Number.parseInt(c1.dialCode, 10) - Number.parseInt(c2.dialCode, 10);
        });

        const title = new TitleCasePipe();

        countries.forEach(entity => {
            const value = { country: names[entity.countryCode], code: entity.dialCode };
            alert.addInput({
                type: 'radio',
                label: `(+${value.code}) ${title.transform(value.country)}  `,
                checked: entity.countryCode === locale.country,

                value: value.code,
                handler: data => {
                    const result = countries.find(c => c.dialCode === data.value);
                    this.selectedCountry = { country: result.countryCode, code: result.dialCode };
                    this.logger.debug('[reset-phone-number-page] selected country :', result);
                }
            });
        });
        alert.addButton({
            role: 'cancel',
            text: 'Close'
        });
        alert.present();

        return;

        const popover = this.popover.create(InternationalPhoneComponent);
        popover.onWillDismiss((data, role) => {
            if (data) {
                this.selectedCountry = data;
            }
        });

        await popover.present({
            ev: event
        });
    }

    public async onClick_Next(): Promise<void> {
        this.logger.debug('[verify-phone-page] phoneNumber : ', this.newPhoneNumber);

        await this.navCtrl.push(VerifyResetPhoneNumberCodeSentPage, {
            phoneNumber: this.selectedCountry.code + this.newPhoneNumber
        });
    }
}

export const RESET_PHONE_NUMBER_COMPONENTS = [ResetPhoneNumberPage, VerifyResetPhoneNumberCodeSentPage, VerifyResetPhoneNumberSecuritycodePage, VerfiyResetPhoneNumberSuccessPage];
