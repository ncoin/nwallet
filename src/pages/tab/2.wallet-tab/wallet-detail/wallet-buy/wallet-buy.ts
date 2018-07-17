import { AppServiceProvider } from '../../../../../providers/app/app.service';
import { Logger } from '../../../../../providers/common/logger/logger';
import { AccountProvider } from '../../../../../providers/account/account';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar, AlertController, LoadingController } from 'ionic-angular';
import { NWallet } from '../../../../../interfaces/nwallet';
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

    private _nchAmount: number = 0;
    private _wallet: NWallet.AssetContext;
    wallets: NWallet.AssetContext[];
    expectSpendWallet: NWallet.AssetContext;

    constructor(
        account: AccountProvider,
        public navCtrl: NavController,
        public navParams: NavParams,
        private logger: Logger,
        private alert: AlertController,
        private appService: AppServiceProvider,
        private loading: LoadingController,
    ) {
        this._wallet = navParams.get('wallet');
        this.expectSpendWallet = <NWallet.AssetContext> {
            item : this._wallet.item,
            amount : "0",
        };
        this.wallets = account.account.wallets.filter(wallet => {
            return wallet.item.asset.code !== 'NCH' && wallet.item.isNative;
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

    backToLobby() {
        this.logger.debug('backToLobby');
        this.navCtrl.popToRoot({
            animate: true,
            animation: 'ios-transition',
        });
    }

    ionViewDidLeave() {
    }

    async onBuyRequest() {
        const alert = this.alert.create({
            title: 'buy NCash',
            message: `PAYING : \n ${this._nchAmount} ${this.wallet.item.asset.code}\n` + `<p>BUY : ${this.expectSpendWallet.amount} ${this.expectSpendWallet.item.asset.code}</p>`,
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
                        await this.appService.requestBuy(this._wallet.item.asset, Number.parseFloat(this._nchAmount.toString()));
                        this.navCtrl.popToRoot();
                        loader.dismiss();
                    },
                },
            ],
        });

        alert.present();
    }
}
