import { EventTypes } from '../../../interfaces/events';
import { LoanNcashTabPage } from '../4.loan-ncash-tab/loan-ncash-tab';
import { BuyNcashTabPage } from '../2.buy-ncash-tab/buy-ncash-tab';
import { WalletDetailPage } from '../../1.detail/wallet-detail.page';
import { Logger } from '../../../providers/common/logger/logger';
import { Component } from '@angular/core';
import { NavController, ModalController, LoadingController, Loading  } from 'ionic-angular';
import { NWallet } from '../../../interfaces/nwallet';
import { EventProvider } from '../../../providers/common/event/event';
import { AccountProvider } from '../../../providers/account/account';
import { NWModalTransition } from '../../../tools/extension/transition';

/**
 * Generated class for the WalletPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

export interface WalletSlide {
    wallets: NWallet.AssetContext[];
}

@Component({
    selector: 'wallet-main-tab',
    templateUrl: 'wallet-main-tab.html',
})
export class WalletMainTabPage {
    walletPages: WalletSlide[] = [];
    nCash: NWallet.AssetContext;
    totalPrice: string;
    private subscription: any;
    private loading: Loading;
    constructor(public navCtrl: NavController, private event: EventProvider, private logger: Logger, private account: AccountProvider, private modalCtrl: ModalController, public loadingCtrl: LoadingController) {
        this.init();
    }

    ionViewDidLoad() {
        this.navCtrl.getActive().showBackButton(false);
    }

    ionViewDidEnter() {
        if (!this.subscription) {
            this.subscription = this.event.subscribe(EventTypes.NWallet.account_refresh_wallet, this.refreshWallets);
        }
    }

    ionViewDidLeave() {
        this.event.unsubscribe(EventTypes.NWallet.account_refresh_wallet, this.subscription);
        this.subscription = undefined;
    }

    async init(): Promise<void> {
        this.loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: 'Loading Please Wait...'
        });
        this.loading.present();

        const account = await this.account.getAccount();
        if (account && account.wallets) {
            this.refreshWallets(account.wallets.slice());

            setTimeout(() => {
                this.loading.dismiss();
            }, 1000);
        }
    }

    private refreshWallets = (assets: NWallet.AssetContext[]): void => {
        this.logger.debug('[wallet-tab] on refresh assets');
        const nCash = assets.find(wallet => {
            return wallet.item.isNative === true && wallet.item.asset.code === 'NCN';
        });

        let totalAmount = 0;
        assets.forEach(wallet => {
            totalAmount += Number.parseFloat(wallet.amount) * wallet.item.price;
        });

        this.totalPrice = totalAmount.toFixed(2).toString();

        assets.splice(assets.indexOf(nCash), 1);

        this.walletPages.length = 0;
        let sliceWallet = assets.splice(0, 3);

        while (sliceWallet.length > 0) {
            this.walletPages.push({ wallets: sliceWallet });
            sliceWallet = assets.splice(0, 3);
        }

        this.nCash = nCash;
    }

    public onSelectWallet(wallet: NWallet.AssetContext) {
        const modal = this.modalCtrl.create(WalletDetailPage, { wallet: wallet}, NWModalTransition.Slide());
        modal.present();
    }
}

export const WalletTabPages = [WalletMainTabPage, WalletDetailPage, BuyNcashTabPage, LoanNcashTabPage];
