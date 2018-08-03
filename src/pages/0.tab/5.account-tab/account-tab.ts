import { PreferenceProvider, Preference } from './../../../providers/common/preference/preference';
import { TranslateService } from '@ngx-translate/core';
import { AppConfigProvider } from '../../../providers/app/app.config';
import { Logger } from '../../../providers/common/logger/logger';
import { AccountProvider } from '../../../providers/account/account';
import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { EntrancePage } from '../../0.entrance/entrance';
import { AppServiceProvider } from '../../../providers/app/app.service';
import { Constants } from '../../../environments/template';

@IonicPage()
@Component({
    selector: 'page-account-tab',
    templateUrl: 'account-tab.html',
})
export class AccountTabPage {
    _enablePushNotification: boolean;
    supportedLanguagesPair: { key: string; value: string }[];
    currentLanguage: { key: string; value: string } = { key: '', value: '' };

    public get enablePushNotification(): boolean {
        return this._enablePushNotification;
    }

    public set enablePushNotification(value: boolean) {
        this.logger.debug('[account-tab] push notification set', value);
        this._enablePushNotification = value;
        this.setNotification(value);
    }

    constructor(
        public navCtrl: NavController,
        private appService: AppServiceProvider,
        private account: AccountProvider,
        private appConfig: AppConfigProvider,
        private logger: Logger,
        private toast: ToastController,
        private translate: TranslateService,
    ) {
        this.init();
    }

    private async init() {
        const promises = Constants.supportedLanuages.map(async lang => {
            const trans = await this.translate.getTranslation(lang).toPromise();
            return { key: lang, value: trans.CurrentLanguage as string };
        });

        // prevent get traslation bug.. ask me --sky`
        this.translate.getTranslation(this.translate.currentLang);

        this.supportedLanguagesPair = await Promise.all(promises);
        const currentLanguage = this.supportedLanguagesPair.find(pair => {
            return pair.key === this.translate.currentLang;
        });

        this.currentLanguage = currentLanguage;
    }

    public onLanguageChanged(language: { key: string; value: string }): void {
        this.appConfig.saveLanguage(language.key);
    }

    public async onLogout(): Promise<void> {
        const account = await this.account.getAccount();
        await this.appService.logout(account);

        this.navCtrl.setRoot(EntrancePage, undefined, {
            animate: true,
            animation: 'ios-transition',
        });
    }

    private async setNotification(isEnable: boolean): Promise<void> {
        const result = await this.appConfig.setPushNotification(isEnable);
        // wait result;
        const toast = this.toast.create({
            message: `request \`${isEnable}\` => result \`${result}\``,
            duration: 1000,
        });

        this._enablePushNotification = result;

        toast.present();
    }
}
