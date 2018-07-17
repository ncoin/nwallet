import { EventTypes } from '../../../interfaces/events';
import { WalletLoanPage } from './wallet-detail/wallet-loan/wallet-loan';
import { WalletBuyPage } from './wallet-detail/wallet-buy/wallet-buy';
import { EntrancePage } from '../../0.entrance/entrance';
import { WalletDetailPage } from './wallet-detail/wallet-detail';
import { Logger } from '../../../providers/common/logger/logger';
import { Component, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NWallet } from '../../../interfaces/nwallet';
import { EventProvider } from '../../../providers/common/event/event';

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
    selector: 'tab-wallet',
    templateUrl: 'wallet-tab.html',
})
export class WalletPage {
    walletPages: WalletSlide[] = [];
    nCash: NWallet.AssetContext;
    totalPrice: string;
    private subscription: any;
    constructor(public navCtrl: NavController, public navParams: NavParams, private zone: NgZone, private event: EventProvider, private logger: Logger) {
        this.init();
    }

    ionViewDidLoad() {
        this.navCtrl.getActive().showBackButton(false);
    }

    init(): any {
        this.subscription = this.event.subscribe(EventTypes.NWallet.account_refresh_wallet, wallets => {
            const nCash = wallets.find(wallet => {
                return wallet.item.isNative === true && wallet.item.asset.code === 'NCH';
            });

            let totalAmount = 0;
            wallets.forEach(wallet => {
                totalAmount += Number.parseFloat(wallet.amount) * wallet.item.price;
            });

            this.totalPrice = totalAmount.toString();

            wallets.splice(wallets.indexOf(nCash), 1);

            this.logger.debug('[wallet-tab] on wallet changed');
            this.walletPages.length = 0;
            let sliceWallet = wallets.splice(0, 3);

            this.zone.run(() => {
                while (sliceWallet.length > 0) {
                    this.walletPages.push({ wallets: sliceWallet });
                    sliceWallet = wallets.splice(0, 3);
                }

                this.nCash = nCash;
            });
        });
    }

    public onSelectWallet(wallet: NWallet.AssetContext) {
        this.navCtrl.push(
            WalletDetailPage,
            { wallet: wallet },
            {
                animate: true,
                animation: 'ios-transition',
            },
        );
    }

    public onLogout(): void {
        // this.appService.logout(this.account);
        this.navCtrl.setRoot(EntrancePage, undefined, {
            animate: true,
            animation: 'ios-transition',
        });
    }
}

export const WalletTabPages = [WalletPage, WalletDetailPage, WalletBuyPage, WalletLoanPage];
