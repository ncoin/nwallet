import { ViewChild } from '@angular/core';
import { Logger } from './../../providers/common/logger/logger';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar } from 'ionic-angular';
import { NWallet } from '../../interfaces/nwallet';
import { WalletBuyPage } from './wallet-buy/wallet-buy';

/**
 * Generated class for the WalletDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-wallet-detail',
    templateUrl: 'wallet-detail.html',
})
export class WalletDetailPage {
    isNCH: boolean;
    wallet: NWallet.WalletItem;
    histories: NWallet.Transaction[];

    @ViewChild(Navbar) navBar: Navbar;
    constructor(public navCtrl: NavController, public navParams: NavParams, private logger: Logger) {
        this.logger.debug(navParams);
        this.wallet = navParams.get('wallet');
        this.isNCH = this.wallet.asset.getIssuer() === NWallet.NCH.getIssuer() && this.wallet.asset.getCode() === NWallet.NCH.getCode();
    }

    ionViewDidLoad() {
        //todo extract --sky
        this.navBar.backButtonClick = ev => {
            ev.preventDefault();
            ev.stopPropagation();
            this.navCtrl.pop({
                animate: true,
                animation: 'ios-transition',
            });
        };
    }

    onBuyAsset() {
        this.navCtrl.push(WalletBuyPage, { wallet: this.wallet}, {
            animate: true,
            animation: 'ios-transition',
        });
    }

    onLoanAsset() {}
}
