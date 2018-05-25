import { WalletPage } from './../0.main/wallet';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the CreateaccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-createaccount',
    templateUrl: 'createaccount.html',
})
export class CreateAccountPage {
    constructor(public navCtrl: NavController, public navParams: NavParams) {}

    ionViewDidLoad() {
        setTimeout(async () => {
            const current = this.navCtrl.getActive();
            await this.navCtrl.push(WalletPage, undefined, undefined, async () => {
                await this.navCtrl.removeView(current);
            });
        }, 1000);
    }
}
