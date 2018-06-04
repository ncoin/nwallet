import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar, List } from 'ionic-angular';
import { Asset } from 'stellar-sdk';
import { AccountProvider } from '../../../providers/account/account';
import { NWallet } from '../../../interfaces/nwallet';

/**
 * Generated class for the WalletBuyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-wallet-buy',
    templateUrl: 'wallet-buy.html',
})
export class WalletBuyPage {
    @ViewChild(Navbar) navBar: Navbar;
    @ViewChild('walletSelectList') selections: List;
    buyContext: { amount: string; asset: Asset };
    wallets: NWallet.WalletItem[] = NWallet.WalletEmpty;
    constructor(public navCtrl: NavController, public navParams: NavParams, private account: AccountProvider, private zone:NgZone) {
        this.buyContext = { amount: '0', asset: Asset.native() };
        this.wallets = account.account.wallets;
    }

    async init(): Promise<void>{
        const account = await this.account.getAccount();
        account;
        this.zone.run(()=> {
        });
    }

    test() {
        var d = this.buyContext;
        var asd = this.wallets;
        asd;
        d;
    }

    ionViewDidLoad() {
        this.navBar.backButtonClick = ev => {
            ev.preventDefault();
            ev.stopPropagation();
            this.navCtrl.pop({
                animate: true,
                animation: 'ios-transition',
            });
        };
    }
}
