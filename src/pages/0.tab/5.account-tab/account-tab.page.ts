import { AppConfigService } from '../../../providers/app/app.config.service';
import { LoggerService } from '../../../providers/common/logger/logger.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController, AlertController } from 'ionic-angular';
import { EntrancePage } from '../../0.entrance/entrance.page';
import { NWalletAppService } from '../../../providers/app/app.service';
import { MyInfoPage } from './my-info/my-info.page';
import { LanguagePage } from './language/language.page';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
    selector: 'account-tab',
    templateUrl: 'account-tab.page.html'
})
export class AccountTabPage {
    _enablePushNotification: boolean;

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
        private appService: NWalletAppService,
        private appConfig: AppConfigService,
        private logger: LoggerService,
        private toast: ToastController,
        private alert: AlertController,
        private translate: TranslateService
    ) {}

    public async onLogout() {
        const langs = this.translate.instant(['Logout', 'Cancel', 'LogoutAskHeader', 'LogoutAskContent']);

        const alert = this.alert.create({
            cssClass: 'alert-base alert-logout title-underline button-center',
            title: langs['Logout'],
            message: `<div class="alert-message-header">${langs['LogoutAskHeader']}</div>` + `<div class="alert-message-content">${langs['LogoutAskContent']}</div>`,
            buttons: [
                {
                    role: 'cancel',
                    text: langs['Cancel'],
                    handler: () => {},
                    cssClass: 'button-cancel'
                },
                {
                    text: langs['Logout'],
                    role: null,
                    handler: async () => {
                        await this.appService.logout();

                        this.navCtrl.setRoot(EntrancePage, undefined, {
                            animate: true,
                            animation: 'ios-transition'
                        });
                    },
                    cssClass: 'button-ok'
                }
            ]
        });

        alert.present();
    }

    public onClick_Language(): void {
        this.navCtrl.push(LanguagePage, {}, { animate: false });
    }

    public async onClick_MyInfo(): Promise<void> {
        this.navCtrl.push(MyInfoPage, {}, { animate: false });
    }

    public async onClick_Notification(isEnable: boolean): Promise<void> {
        this._enablePushNotification = isEnable;

        const result = await this.appConfig.setPushNotification(isEnable);
        if (!result) {
            this._enablePushNotification = !isEnable;
        }
        // wait result;
        const toast = this.toast.create({
            message: `request \`${isEnable}\` => result \`${result}\``,
            duration: 1000
        });

        toast.present();
    }
}
