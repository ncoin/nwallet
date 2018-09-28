import { AppConfigProvider } from '../../../providers/app/app.config';
import { LoggerService } from '../../../providers/common/logger/logger.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { EntrancePage } from '../../0.entrance/entrance.page';
import { AppServiceProvider } from '../../../providers/app/app.service';
import { MyInfoPage } from './my-info/my-info.page';

@IonicPage()
@Component({
    selector: 'account-tab',
    templateUrl: 'account-tab.page.html',
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
        this.onClick_Notification(value);
    }

    constructor(
        public navCtrl: NavController,
        private appService: AppServiceProvider,
        private appConfig: AppConfigProvider,
        private logger: LoggerService,
        private toast: ToastController
    ) {
        this.init();
    }

    private async init() {
        const languages = await this.appConfig.getCurrentLanguage();
        this.supportedLanguagesPair = languages.languages;
        this.currentLanguage = languages.currentLanguage;
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

    public async onClick_MyInfo(): Promise<void> {
        this.navCtrl.push(
            MyInfoPage,
            {},
            {
                animate: false,
            }
        );
    }

    public async onClick_Notification(isEnable: boolean): Promise<void> {
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
