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
    private subscription: any;
    private loading: Loading;
    constructor(
        public navCtrl: NavController,
        private logger: LoggerService,
        private account: AccountService,
        private modalCtrl: ModalController,
        public loadingCtrl: LoadingController
    ) {
        this.init();
    }

    ionViewDidLoad() {
        this.navCtrl.getActive().showBackButton(false);
    }

    ionViewDidEnter() {}

    ionViewDidLeave() {}

    async init(): Promise<void> {}
}
