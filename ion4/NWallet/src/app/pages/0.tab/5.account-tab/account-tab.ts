import { TranslateService } from '@ngx-translate/core';
import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { EntrancePage } from '../../0.entrance/entrance';
import { NWalletService } from '$services/app/nwallet.service';
import { ConfigService } from '$services/app/config/config.service';
import { LoggerService } from '$services/cores/logger/logger.service';

@IonicPage()
@Component({
    selector: 'account-tab',
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
        private appService: NWalletService,
        private appConfig: ConfigService,
        private logger: LoggerService,
        private toast: ToastController,
        private translate: TranslateService
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
        await this.appService.logout();

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
