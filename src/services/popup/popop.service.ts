import { AlertController, ActionSheetController } from 'ionic-angular';
import { CountryService, LocaleService, Country } from 'ng4-intl-phone';
import { Injectable } from '@angular/core';
import { AppConfigService } from '../app/app.config.service';
import { TitleCasePipe } from '@angular/common';
import { LoggerService } from '../common/logger/logger.service';
import { PromiseWaiter } from 'forge/dist/helpers/Promise/PromiseWaiter';
import { NWAsset } from '../../models/nwallet';
import { AssetFormatPipe } from '../../pipes/asset/asset-format';
import { AssetNamePipe } from '../../pipes/asset/asset-name';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class PopupService {
    private countries: Country[];
    constructor(
        private alert: AlertController,
        private actionSheet: ActionSheetController,
        private country: CountryService,
        private locale: LocaleService,
        private appConfig: AppConfigService,
        private logger: LoggerService,
        private translate: TranslateService
    ) {
        this.init();
    }
    init(): void {
        this.countries = this.country.getCountries().slice();
        this.countries.sort((c1, c2) => {
            return Number.parseInt(c1.dialCode, 10) - Number.parseInt(c2.dialCode, 10);
        });
    }

    public async selectCountry(currentCode?: string) {
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
                label: `(+${country.dialCode}) ${country.fullName}`,
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

    public async selecteWallet(selectedAsset: NWAsset.Item, assets: NWAsset.Item[]) {
        if (!assets || assets.length < 1) {
            return;
        }
        const wait = new PromiseWaiter<NWAsset.Item>();
        const alert = this.alert.create({
            cssClass: 'alert-base alert-radio-group button-center auto-stretch label-justify'
        });

        const format = new AssetFormatPipe();

        assets.forEach(asset => {
            alert.addInput({
                type: 'radio',
                label: `${this.translate.instant(asset.getSymbol())} ${format.transform(asset)}`,
                checked: asset.getSymbol() === selectedAsset.getSymbol(),
                handler: () => {
                    alert.dismiss(asset);
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
