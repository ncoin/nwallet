import { NWEvent } from '../../../interfaces/events';
import { LoanNcashTabPage } from '../4.loan-ncash-tab/loan-ncash-tab';
import { BuyNcashTabPage } from '../2.buy-ncash-tab/buy-ncash-tab';
import { WalletDetailPage } from '../../1.detail/wallet-detail.page';
import { LoggerService } from '../../../providers/common/logger/logger.service';
import { Component } from '@angular/core';
import { NavController, ModalController, LoadingController, Loading } from 'ionic-angular';
import { NWallet } from '../../../interfaces/nwallet';
import { EventProvider } from '../../../providers/common/event/event';
import { AccountService } from '../../../providers/account/account.service';
import { NWModalTransition } from '../../../tools/extension/transition';
import { ManageWalletPage } from './manage-wallet/manage-wallet.page';
import { AddWalletPage } from './add-wallet/add-wallet.page';
import { NWAsset, NWAccount } from '../../../models/nwallet';
import { ModalNavPage } from '../../0.base/modal-nav.page';
import { NWalletAppService } from '../../../providers/app/app.service';
import { Subscription } from 'rxjs';

/**
 * Generated class for the WalletPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

export interface AssetSlide {
    assets: NWAsset.Item[];
}

@Component({
    selector: 'wallet-main-tab',
    templateUrl: 'wallet-main-tab.html'
})
export class WalletMainTabPage {
    assetSlides: AssetSlide[] = [];
    totalPrice: string;
    private subscriptions: Subscription[] = [];
    private loading: Loading;
    constructor(
        public navCtrl: NavController,
        private event: EventProvider,
        private logger: LoggerService,
        private modalCtrl: ModalController,
        public loadingCtrl: LoadingController,
        private app: NWalletAppService
    ) {
        this.init();
    }

    ionViewDidLeave() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    async init(): Promise<void> {
        this.loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: 'Loading Please Wait...'
        });
        await this.loading.present();
        await this.app.waitFetch();
        await this.loading.dismiss();
        this.app.onAccount(account => {
            this.register(account.onInventory.subscribe(this.refreshInventory));
        });
        // await this.account.getInventory().

    }

    private register(subscription: Subscription): void {
        this.subscriptions.push(subscription);
    }

    private refreshInventory = (inventory: NWAccount.Inventory): void => {
        this.logger.debug('[wallet-tab] on refresh assets');

        const totalAmount = inventory.totalPrice();
        this.totalPrice = totalAmount.toFixed(2).toString();

        this.assetSlides.length = 0;
        let sliceWallet = inventory.assetItems.splice(0, 3);

        while (sliceWallet.length > 0) {
            this.assetSlides.push({ assets: sliceWallet });
            sliceWallet = inventory.assetItems.splice(0, 3);
        }
    }

    public onSelectAsset(wallet: NWAsset.Item) {
        const modal = this.modalCtrl.create(WalletDetailPage, { wallet: wallet }, NWModalTransition.Slide());
        modal.present();
    }

    public async onClick_ManageWallet(): Promise<void> {
        const modal = this.modalCtrl.create(
            ModalNavPage,
            ModalNavPage.resolveModal(ManageWalletPage, param => {
                param.headerType = 'bar';
                param.canBack = true;
            })
        );
        await modal.present();
    }
}

export const WalletTabPages = [WalletMainTabPage, WalletDetailPage, BuyNcashTabPage, LoanNcashTabPage, ManageWalletPage, AddWalletPage];
