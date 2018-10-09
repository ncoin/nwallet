import { NWalletAppService } from '../../../providers/app/app.service';
// import { Logger } from '../../../providers/common/logger/logger';
import { AccountService } from '../../../providers/account/account.service';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar, AlertController, LoadingController } from 'ionic-angular';
import { NWallet, getOrAddWalletItem } from '../../../interfaces/nwallet';

@IonicPage()
@Component({
    selector: 'buy-ncash-tab',
    templateUrl: 'buy-ncash-tab.html',
})
export class BuyNcashTabPage {
    @ViewChild(Navbar) navBar: Navbar;

    private _sourceAssetAmount = 0;
    private _sourceAsset: NWallet.AssetContext;
    availableAssets: NWallet.AssetContext[] = [];
    expectedNCHContext: NWallet.AssetContext;
    expectedMaxNCHAmount: number;


    constructor(
        private account: AccountService,
        public navCtrl: NavController,
        public navParams: NavParams,
        // private logger: Logger,
        private alert: AlertController,
        private appService: NWalletAppService,
        private loading: LoadingController,
    ) {
        this._sourceAsset = this.account.getNativeWallet();
        const nch = getOrAddWalletItem(NWallet.Assets.NCH.code, NWallet.Assets.NCH.issuer, false);

        this.expectedNCHContext = <NWallet.AssetContext>{
            item: nch,
            amount: '0',
        };
        this.expectedMaxNCHAmount = Number.parseFloat(this.sourceAsset.amount) * this.sourceAsset.item.price;

        const availables = account.account.wallets.filter(wallet => {
            return wallet.item.asset.code !== 'NCH' && wallet.item.isNative;
        });

        this.availableAssets.push(...availables);
    }

    public set sourceAssetAmount(value: number) {
        this._sourceAssetAmount = value;
        this.calcualteExpectedNCHAmount();
    }

    public get sourceAssetAmount(): number {
        return this._sourceAssetAmount;
    }

    public get sourceAsset(): NWallet.AssetContext {
        return this._sourceAsset;
    }

    public set sourceAsset(wallet: NWallet.AssetContext) {
        this._sourceAsset = wallet;
        this.calcualteExpectedNCHAmount();
    }

    private calcualteExpectedNCHAmount(): void {
        // to usd
        const totalPrice = this.sourceAssetAmount * this.sourceAsset.item.price;
        const nch = getOrAddWalletItem(NWallet.Assets.NCH.code, NWallet.Assets.NCH.issuer, false);
        this.expectedNCHContext = <NWallet.AssetContext>{
            amount: totalPrice.toString(),
            item: nch,
            price: nch.price
        };

        this.expectedMaxNCHAmount = Number.parseFloat(this.sourceAsset.amount) * this.sourceAsset.item.price;
    }

    public onMaxBuy(): void {
        this.sourceAssetAmount = Number.parseFloat(this._sourceAsset.amount);
    }

    public onAssetChanged(): void {
        this.sourceAssetAmount = 0;
    }

    public async onBuyRequest() {

        let nchAmount = Number.parseFloat(this.expectedNCHContext.amount.toString());
        nchAmount = Math.floor(nchAmount * 1000000) / 1000000;
        const alert = this.alert.create({
            title: 'buy NCash',
            message:
                `PAYING : \n ${this._sourceAssetAmount} ${this.sourceAsset.item.asset.code}\n` +
                `<p>BUY : ${nchAmount} ${this.expectedNCHContext.item.asset.code}</p>`,
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
                        // await this.appService.requestBuy(this._sourceAsset.item.asset, nchAmount);
                        // this.navCtrl.popToRoot();
                        loader.dismiss();
                    },
                },
            ],
        });

        alert.present();
    }
}
