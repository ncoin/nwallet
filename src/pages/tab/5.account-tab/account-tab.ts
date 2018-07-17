import { AccountProvider } from './../../../providers/account/account';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EntrancePage } from '../../0.entrance/entrance';
import { AppServiceProvider } from '../../../providers/app/app.service';

/**
 * Generated class for the AccountTabPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-account-tab',
    templateUrl: 'account-tab.html',
})
export class AccountTabPage {
    constructor(public navCtrl: NavController, public navParams: NavParams, private appService: AppServiceProvider, private account: AccountProvider) {}

    ionViewDidLoad() {
        console.log('ionViewDidLoad AccountTabPage');
    }

    public async onLogout(): Promise<void> {

        // app component root -> entrance

        const account = await this.account.getAccount();
        await this.appService.logout(account);
        this.navCtrl.setRoot(EntrancePage, undefined, {
            animate: true,
            animation: 'ios-transition',
        });
    }
}
