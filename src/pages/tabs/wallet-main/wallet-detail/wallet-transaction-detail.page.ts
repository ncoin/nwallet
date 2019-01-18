import { LoggerService } from '../../../../services/common/logger/logger.service';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavParams, NavController, Navbar } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import * as _ from 'lodash';
import { NWTransaction, NWAsset } from '../../../../models/nwallet';
import { CurrencyService } from '../../../../services/nwallet/currency.service';

@IonicPage()
@Component({
    selector: 'wallet-transaction-detail',
    templateUrl: 'wallet-transaction-detail.page.html'
})
export class WalletTransactionDetailPage {
    @ViewChild(Navbar)
    navBar: Navbar;
    public transaction: NWTransaction.Item;
    public wallet: NWAsset.Item;

    constructor(private navCtrl: NavController, params: NavParams, private logger: LoggerService, private browser: InAppBrowser, private currency: CurrencyService) {
        this.transaction = params.get('transaction');
        this.wallet = params.get('wallet');
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

    public currentPrice(): string {
        const digits = 2;
        const price = this.transaction.amount * this.currency.getPrice(this.wallet.getCurrencyId());
        const floor = _.floor(price, digits);
        const formattedValue = floor.toLocaleString('en-US', {
            minimumFractionDigits: digits,
            maximumFractionDigits: digits
        });

        return `$${formattedValue}`;
    }

    public onExploreTransaction(): void {}
}
