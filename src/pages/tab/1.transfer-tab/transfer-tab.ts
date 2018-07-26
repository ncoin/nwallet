import { Logger } from './../../../providers/common/logger/logger';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Navbar, InfiniteScroll, ToastController } from 'ionic-angular';

/**
 * Generated class for the WalletDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector : 'page-transfer-tab',
    templateUrl: 'transfer-tab.html',
})
export class TransferTabPage {
    @ViewChild(Navbar) navBar: Navbar;
    constructor(public navCtrl: NavController, private logger: Logger, private toast: ToastController) {}

    public async doInfinite(infinite: InfiniteScroll): Promise<void> {
        // this.logger.debug('[wallet-detail-page]has next', this.hasNext);

        this.logger.debug('load');
        setTimeout(() => {

        this.logger.debug('done');


            infinite.complete();
        }, 3000);
    }
}
