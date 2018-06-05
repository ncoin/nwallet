import { CurrencyProvider } from './../../../providers/currency/currency';
import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar, List } from 'ionic-angular';
import { AccountProvider } from '../../../providers/account/account';
import { NWallet } from '../../../interfaces/nwallet';

/**
 * Generated class for the WalletLoanPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-wallet-loan',
    templateUrl: 'wallet-loan.html',
})
export class WalletLoanPage {
    @ViewChild(Navbar) navBar: Navbar;

    loanContext: { toNCH: number };
    wallets: NWallet.WalletItem[] = NWallet.WalletEmpty;
    private _amount:number;
    private _wallet:NWallet.WalletItem;

    constructor(public navCtrl: NavController, public navParams: NavParams, private account: AccountProvider, private zone: NgZone, private currency: CurrencyProvider) {
        const wallet = navParams.get("wallet");
        this.loanContext = {  toNCH: 0 };
        this.wallet = wallet;
        this.wallets = account.account.wallets;
        this.amount = 0;
    }

    public set amount(value: number){
        this._amount = value;
        this.calculateTotalNCN();
    }

    public get amount():number {
        return this._amount;
    }

    public get wallet():NWallet.WalletItem {
        return this._wallet;
    }

    public set wallet(wallet:NWallet.WalletItem) {
        this._wallet = wallet;
        this.calculateTotalNCN();
    }

    private calculateTotalNCN(): void {
        const totalPrice = this.amount * this.wallet.price;
        const nch = this.currency.getCurrencyInfo("-1");
        this.loanContext.toNCH = totalPrice / nch.getValue().price;
    }

    async init(): Promise<void> {
        const account = await this.account.getAccount();
        account;
        this.zone.run(() => {});
    }

    test() {
        var d = this.loanContext;
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
