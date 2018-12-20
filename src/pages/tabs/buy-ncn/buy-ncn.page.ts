import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NWAsset } from '../../../models/nwallet';
import { EventService } from '../../../services/common/event/event.service';
import { NWEvent } from '../../../interfaces/events';
import { AccountService } from '../../../services/account/account.service';
import { Subscription } from 'rxjs';
import { Debug } from '../../../utils/helper/debug';
import { LoggerService } from '../../../services/common/logger/logger.service';
import { CurrencyService } from '../../../services/nwallet/currency.service';
import { BuyNcnConfirmPage } from './buy-ncn-confirm/buy-ncn-confirm.page';
import { BuyNcnResultPage } from './buy-ncn-result/buy-ncn-result.page';
import { PopupService } from '../../../services/popup/popop.service';
import { NWConstants } from '../../../models/constants';

@IonicPage()
@Component({
    selector: 'page-buy-ncn',
    templateUrl: 'buy-ncn.page.html'
})
export class BuyNcnPage implements OnInit {
    private subsciptions: Subscription[] = [];
    public selectedWallet: NWAsset.Item;
    public assets: NWAsset.Item[];
    public buyNcnAmount = 0;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private event: EventService,
        private account: AccountService,
        private logger: LoggerService,
        private currency: CurrencyService,
        private popup: PopupService
    ) {}

    async ngOnInit() {
        this.account.registerSubjects(account => {
            this.subsciptions.push(account.walletChanged(assets => (this.assets = assets)));
        });

        this.event.RxSubscribe(NWEvent.App.change_tab, context => {
            if (context && context.index === 1) {
                this.onSelectAsset(context.currencyId);
            } else {
                const wallets = this.assets.filter(asset => asset.getCurrencyId() !== NWConstants.NCN.currencyId);
                this.selectedWallet = wallets[0];
            }
        });
    }

    private async onSelectAsset(currencyId: number): Promise<void> {
        const account = await this.account.detail();
        const targetWallet = account.inventory
            .getAssetItems()
            .getValue()
            .find(asset => asset.getCurrencyId() === currencyId);

        this.selectedWallet = targetWallet;
    }

    public async onClick_ChangeWallet() {
        const task = await this.popup.selecteWallet(this.selectedWallet, this.assets.filter(asset => asset.getCurrencyId() !== NWConstants.NCN.currencyId));
        this.selectedWallet = task;
    }

    public onClick_ShortCut(value: number) {
        const maxAmount = this.currency.getPrice(this.selectedWallet.getCurrencyId()) * this.selectedWallet.getAmount();
        if (value) {
            const accumAmount = this.buyNcnAmount + value;
            this.buyNcnAmount = Math.min(accumAmount, maxAmount);
        } else {
            this.buyNcnAmount = maxAmount;
        }
    }

    public onClick_Buy(): void {
        this.navCtrl.push(BuyNcnConfirmPage, {
            wallet: this.selectedWallet,
            buyNcnAmount: this.buyNcnAmount
        });
    }
}

export const BUY_NCN_PAGES = [BuyNcnPage, BuyNcnConfirmPage, BuyNcnResultPage];
