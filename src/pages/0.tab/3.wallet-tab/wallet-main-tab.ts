import { LoggerService } from '../../../providers/common/logger/logger.service';
import { Component } from '@angular/core';
import { NavController, ModalController, LoadingController, Loading } from 'ionic-angular';
import { EventService } from '../../../providers/common/event/event';
import { AccountService } from '../../../providers/account/account.service';
import { NWModalTransition } from '../../../tools/extension/transition';
import { ManageWalletPage } from './manage-wallet/manage-wallet.page';
import { AddWalletPage } from './add-wallet/add-wallet.page';
import { NWAsset, NWAccount } from '../../../models/nwallet';
import { ModalNavPage } from '../../0.base/modal-nav.page';
import { NWalletAppService } from '../../../providers/app/app.service';
import { Subscription, Observable } from 'rxjs';
import { WalletDetailPage } from './wallet-detail/wallet-detail.page';
import { CurrencyService } from '../../../providers/nsus/currency.service';
import _ from 'lodash';
import { WalletTransactionDetailPage } from './wallet-detail/wallet-transaction-detail.page';

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
    public assetSlides: AssetSlide[] = [];
    public totalPrice: string;
    private subscriptions: Subscription[] = [];
    private loading: Loading;

    constructor(
        public navCtrl: NavController,
        private logger: LoggerService,
        private modalCtrl: ModalController,
        public loadingCtrl: LoadingController,
        private app: NWalletAppService,
        private account: AccountService,
        private currency: CurrencyService
    ) {
        this.init();
    }

    ionViewDidLeave() {

        // todo hmm.. logout? --sky
        // this.logger.debug('[wallet-main-tab] unsubscribe');
        // this.subscriptions.forEach(s => s.unsubscribe());
    }

    async init(): Promise<void> {
        this.loading = this.loadingCtrl.create({
            content: 'Loading Please Wait...'
        });

        await this.loading.present();
        await this.app.waitFetch();

        this.account.registerSubjects(account => {
            this.register(account.assetChanged(this.onAssetChanged));
            this.register(this.currency.currencyChanged.subscribe(this.calculateTotalPrice));
        });

        await this.loading.dismiss();

    }

    private register(...subscription: Subscription[]): void {
        this.subscriptions.push(...subscription);
    }

    private onAssetChanged = async (assets: NWAsset.Item[]): Promise<void> => {
        const items = assets.slice();
        this.logger.debug('[wallet-main-tab] on refresh assets');

        this.assetSlides.length = 0;
        let sliceWallet = items.splice(0, 3);

        while (sliceWallet.length > 0) {
            this.assetSlides.push({ assets: sliceWallet });
            sliceWallet = items.splice(0, 3);
        }

        this.calculateTotalPrice();
    }

    private calculateTotalPrice = () => {
        this.totalPrice = _.sumBy(this.assetSlides, slide => _.sumBy(slide.assets, asset => asset.getAmount() * this.currency.getPrice(asset.getCurrencyId())))
            .toFixed(2)
            .toString();
        this.logger.debug('[wallet-main-tab] total price update', this.totalPrice);
    }

    public async onSelectAsset(wallet: NWAsset.Item) {
        const modal = this.modalCtrl.create(
            ModalNavPage,
            ModalNavPage.resolveModal(WalletDetailPage, param => {
                param.headerType = 'none';
                param.canBack = true;
                param.asset = wallet;
            })
        );
        await modal.present();
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

export const WalletTabPages = [WalletMainTabPage, WalletDetailPage, ManageWalletPage, AddWalletPage, WalletTransactionDetailPage];
