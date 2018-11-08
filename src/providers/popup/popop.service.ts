import { AlertController } from 'ionic-angular';
import { CountryService, LocaleService, Country } from 'ng4-intl-phone';
import { Injectable } from '@angular/core';
import { AppConfigService } from '../app/app.config.service';
import { TitleCasePipe } from '@angular/common';
import { LoggerService } from '../common/logger/logger.service';
import { PromiseWaiter } from 'forge/dist/helpers/Promise/PromiseWaiter';

@Injectable()
export class PopupService {
    private countries: Country[];
    constructor(
        private alert: AlertController,
        private country: CountryService,
        private locale: LocaleService,
        private appConfig: AppConfigService,
        private logger: LoggerService
    ) {
        this.init();
    }
    init(): void {
        this.countries = this.country.getCountries().slice();
        this.countries.sort((c1, c2) => {
            return Number.parseInt(c1.dialCode, 10) - Number.parseInt(c2.dialCode, 10);
        });
    }

    public async selectCountry(currentCode?: string ) {
        const wait = new PromiseWaiter<{ code: string; fullName: string; dialCode: string }>();
        const alert = this.alert.create({
            cssClass: 'alert-base alert-radio-group button-center auto-stretch'
        });

        const currentLocale = await this.appConfig.getLocale();
        const locales = this.locale.getLocales(currentLocale.language);
        const title = new TitleCasePipe();

        this.countries.forEach(entity => {
            const country = { code: entity.countryCode, fullName: title.transform(locales[entity.countryCode]), dialCode: entity.dialCode };
            alert.addInput({
                type: 'radio',
                label: `(+${country.dialCode}) ${country.fullName}  `,
                checked: entity.countryCode === (currentCode ? currentCode : currentLocale.country),
                handler: () => {
                    alert.dismiss(country);
                }
            });
        });

        alert.onWillDismiss((data, role) => {
            wait.set(data);
        });

        alert.present();
        return wait.result();
    }
}
