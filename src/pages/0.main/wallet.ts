import { Logger } from './../../providers/common/logger/logger';
import { EntrancePage } from './../0.entrance/entrance';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the WalletPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-wallet',
    templateUrl: 'wallet.html',
})
export class WalletPage {
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private logger: Logger,
    ) {}

    ionViewDidLoad() {
        this.logger.debug('ionViewDidLoad WalletPage');
        this.navCtrl.getActive().showBackButton(false);
    }

    public onClick(): void {
        this.navCtrl.setRoot(EntrancePage, undefined, {
            animate: true,
            animation: 'wp-transition',
        });
        this.logger.debug('onClick');
    }

    public onClear(): void {
        this.navCtrl.setRoot(EntrancePage, undefined, {
            animate: true,
            animation: 'ios-transition',
        });
        this.logger.debug('onClear');
    }

    public onLogOut(): void {
        this.navCtrl.setRoot(EntrancePage, undefined, {
            animate: true,
            animation: 'ios-transition',
        });
    }
}
