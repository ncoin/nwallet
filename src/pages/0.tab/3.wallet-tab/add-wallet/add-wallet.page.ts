import { Component } from '@angular/core';
import { NavController, ModalController, LoadingController, Loading, IonicPage } from 'ionic-angular';
import { LoggerService } from '../../../../providers/common/logger/logger.service';
import { AccountService } from '../../../../providers/account/account.service';

@Component({
    selector: 'add-wallet',
    templateUrl: 'add-wallet.page.html',
})
export class AddWalletPage {
    totalPrice: string;
    constructor(
        public navCtrl: NavController,
        public loadingCtrl: LoadingController
    ) {
        this.init();
    }

    ionViewDidLoad() {
    }

    ionViewDidEnter() {}

    ionViewDidLeave() {}

    async init(): Promise<void> {}
}
