import { AppServiceProvider } from '../../../providers/app/app.service';
import { AccountProvider } from '../../../providers/account/account';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar, AlertController, LoadingController } from 'ionic-angular';
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

    private _nchAmount: number = 0;
    private _wallet: NWallet.AssetContext;
    wallets: NWallet.AssetContext[] = [];
    expectSpendWallet: NWallet.AssetContext;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private account: AccountProvider,
        private appService: AppServiceProvider,
        private alert: AlertController,
        private loading: LoadingController,
    ) {
        this._wallet = this.account.getNativeWallet();
        this.expectSpendWallet = <NWallet.AssetContext>{
            item: this._wallet.item,
            amount: '0',
        };

        const availables = account.account.wallets.filter(wallet => {
            return wallet.item.asset.code !== 'NCH' && wallet.item.isNative;
        });
        this.wallets.push(...availables);
    }

    ionViewDidEnter() {
        this._wallet = this.account.getNativeWallet();
        this.expectSpendWallet = <NWallet.AssetContext>{
            item: this._wallet.item,
            amount: '0',
        };

        this.wallets = this.account.account.wallets.filter(wallet => {
            return wallet.item.asset.code !== 'NCH';
        });
    }

    public set nchAmount(value: number) {
        this._nchAmount = value;
        this.calculateTotalNCN();
    }

    public get nchAmount(): number {
        return this._nchAmount;
    }

    public get wallet(): NWallet.AssetContext {
        return this._wallet;
    }

    public set wallet(wallet: NWallet.AssetContext) {
        this._wallet = wallet;
        this.calculateTotalNCN();
    }

    private calculateTotalNCN(): void {
        const totalPrice = (this.nchAmount * 1) / this.wallet.item.price;
        this.expectSpendWallet = <NWallet.AssetContext>{
            amount: totalPrice.toString(),
            item: this._wallet.item,
            price: this.expectSpendWallet.item.price,
        };
    }

    async onLoanRequest() {
        const alert = this.alert.create({
            title: 'Loan NCash',
            message: `PAYING : \n ${this._nchAmount} ${this.wallet.item.asset.code}\n` + `<p>LOAN : ${this.expectSpendWallet.amount} ${this.expectSpendWallet.item.asset.code}</p>`,
            buttons: [
                {
                    text: 'CANCEL',
                    handler: () => {},
                },
                {
                    text: 'OK',
                    handler: async () => {
                        const loader = this.loading.create({
                            content: 'please wait ...',
                        });
                        loader.present();
                        await this.appService.requestLoan(this._wallet.item.asset, Number.parseFloat(this._nchAmount.toString()));
                        this.navCtrl.popToRoot();
                        loader.dismiss();
                    },
                },
            ],
        });

        alert.present();
    }
}
