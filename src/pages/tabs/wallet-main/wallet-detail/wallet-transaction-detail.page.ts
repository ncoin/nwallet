import { LoggerService } from '../../../../services/common/logger/logger.service';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavParams, NavController, Navbar } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { NWTransaction } from '../../../../models/nwallet';

@IonicPage()
@Component({
    selector: 'wallet-transaction-detail',
    templateUrl: 'wallet-transaction-detail.page.html'
})
export class WalletTransactionDetailPage {
    @ViewChild(Navbar)
    navBar: Navbar;
    public transaction: NWTransaction.Item;
    constructor(private navCtrl: NavController, params: NavParams, private logger: LoggerService, private browser: InAppBrowser) {
        this.transaction = params.get('transaction');
        this.init();
    }

    ionViewDidLoad() {
        this.navBar.backButtonClick = () => {
            this.navCtrl.pop({
                animate: true,
                direction: 'back',
                animation: 'ios-transition'
            });
        };
    }

    private async init(): Promise<void> {
        this.logger.debug('[wallet-transaction-page] transaction detail : ', this.transaction);
    }

    public onExploreTransaction(): void {}
}
