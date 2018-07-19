import { AppConfigProvider } from './../../../providers/app/app.config';
import { Logger } from './../../../providers/common/logger/logger';
import { AccountProvider } from './../../../providers/account/account';
import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { EntrancePage } from '../../0.entrance/entrance';
import { AppServiceProvider } from '../../../providers/app/app.service';

@IonicPage()
@Component({
    selector: 'page-account-tab',
    templateUrl: 'account-tab.html',
})
export class AccountTabPage {
    _enablePushNotification: boolean;

    public get enablePushNotification(): boolean {
        return this._enablePushNotification;
    }

    public set enablePushNotification(value: boolean) {
        this.logger.debug('[account-tab] push notification sett', value);
        this._enablePushNotification = value;
        this.setNotification(value);
    }

    constructor(public navCtrl: NavController, private appService: AppServiceProvider, private account: AccountProvider, private appConfig: AppConfigProvider, private logger: Logger, private toast: ToastController) {}

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
            message : `request \`${isEnable}\` => result \`${result}\``,
            duration: 1000,
        });

        this._enablePushNotification = result;

        toast.present();

    }
}
