import { AppServiceProvider } from './../../../providers/app/app.service';
import { Subscription } from 'rxjs/Rx';
import { CurrencyProvider } from './../../../providers/currency/currency';
import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar, AlertController, LoadingController } from 'ionic-angular';
import { AccountProvider } from '../../../providers/account/account';
import { NWallet } from '../../../interfaces/nwallet';
import { Logger } from '../../../providers/common/logger/logger';
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

    private _amount: number = 0;
    private _wallet: NWallet.WalletItem;
    private subscription: Subscription;
    wallets: NWallet.WalletItem[] = NWallet.WalletEmpty;
    NCH: NWallet.WalletItem = {
        amount: '0',
        asset: NWallet.NCH,
        price: 0,
    };

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private account: AccountProvider,
        private zone: NgZone,
        private currency: CurrencyProvider,
        private logger: Logger,
        private alert: AlertController,
        private appService: AppServiceProvider,
        private loading: LoadingController,
    ) {

        this._wallet = navParams.get('wallet');
        this.wallets = account.account.wallets.filter(wallet => {
            return wallet.asset.code !== 'NCH';
        });

        this.subscription = this.currency.getCurrencyInfo('-1').subscribe(cur => {
            this.zone.run(() => {
                this.NCH.price = cur.price;
                this.calculateTotalNCN();
            });
        });
    }

    public set amount(value: number) {
        this._amount = value;
        this.calculateTotalNCN();
    }

    public get amount(): number {
        return this._amount;
    }

    public get wallet(): NWallet.WalletItem {
        return this._wallet;
    }

    public set wallet(wallet: NWallet.WalletItem) {
        this._wallet = wallet;
        this.calculateTotalNCN();
    }

    private calculateTotalNCN(): void {
        const totalPrice = this.amount * this.wallet.price;
        const nch = this.currency.getCurrencyInfo('-1');

        //todo fixme --sky
        this.NCH.amount = (Math.floor((totalPrice / nch.getValue().price) * 100) / 100).toString();
        this.NCH = {
            amount: this.NCH.amount,
            asset: this.NCH.asset,
            price: this.NCH.price,
        };
    }

    async init(): Promise<void> {
        const account = await this.account.getAccount();
        account;
        this.zone.run(() => {});
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
        this.subscription.unsubscribe();
    }

    async onBuyRequest() {
        const alert = this.alert.create({
            title: 'buy NCash',
            message: `PAYING : \n ${this._amount} ${this.wallet.asset.code}\n` + `<p>BUY : ${this.NCH.amount} ${this.NCH.asset.code}</p>`,
            buttons: [
                {
                    text: 'CANCEL',
                    handler: () => {},
                },
                {
                    text: 'OK',
                    handler: async () => {
                        const loader = this.loading.create({
                            content: 'wait ..',
                        });
                        loader.present();
                        const result = await this.appService.requestLoan(this._amount, this._wallet);
                        this.navCtrl.popToRoot();
                        loader.dismiss();
                    },
                },
            ],
        });

        alert.present();
    }
}
