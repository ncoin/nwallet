import { LoggerService } from '../../../services/common/logger/logger.service';
import { Component, OnDestroy } from '@angular/core';
import { NavController, ModalController, LoadingController, Loading } from 'ionic-angular';
import { AccountService } from '../../../services/account/account.service';
import { ManageWalletPage } from './manage-wallet/manage-wallet.page';
import { AddWalletPage } from './add-wallet/add-wallet.page';
import { NWAsset } from '../../../models/nwallet';
import { ModalNavPage } from '../../base/modal-nav.page';
import { NWalletAppService } from '../../../services/app/app.service';
import { Subscription, Observable } from 'rxjs';
import { WalletDetailPage } from './wallet-detail/wallet-detail.page';
import { CurrencyService } from '../../../services/nwallet/currency.service';
import _ from 'lodash';
import { WalletTransactionDetailPage } from './wallet-detail/wallet-transaction-detail.page';
import { LoanPage, LOAN_PAGES } from '../loan/loan.page';

export interface AssetSlide {
    assets: NWAsset.Item[];
}

@Component({
    selector: 'page-wallet-main',
    templateUrl: 'wallet-main.page.html'
})
export class WalletMainPage implements OnDestroy {
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
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    async init(): Promise<void> {
        this.loading = this.loadingCtrl.create({
            content: 'Loading Please Wait...'
        });

        this.loading.present();
        await this.app.waitFetch();

        this.account.registerSubjects(account => {
            this.subscriptions.push(account.assetChanged(this.onAssetChanged));
        });

        this.currency.currencyChanged.subscribe(this.calculateTotalPrice);

        await this.loading.dismiss();
    }

    private onAssetChanged = async (assets: NWAsset.Item[]): Promise<void> => {
        let items = assets.slice();
        items = items.filter(item => item.option.isShow);
        this.logger.debug('[wallet-main-tab] on refresh assets');

        this.assetSlides.length = 0;
        let sliceWallet = items.splice(0, 3);

        while (sliceWallet.length > 0) {
            this.assetSlides.push({ assets: sliceWallet });
            sliceWallet = items.splice(0, 3);
        }

        this.calculateTotalPrice();
    };

    private calculateTotalPrice = () => {
        this.totalPrice = _.sumBy(this.assetSlides, slide => _.sumBy(slide.assets, asset => asset.getAmount() * this.currency.getPrice(asset.getCurrencyId())))
            .toFixed(2)
            .toString();
        this.logger.debug('[wallet-main-tab] total price update :', this.totalPrice);
    };

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

export const WalletTabPages = [WalletMainPage, WalletDetailPage, ManageWalletPage, AddWalletPage, WalletTransactionDetailPage, ...LOAN_PAGES];
