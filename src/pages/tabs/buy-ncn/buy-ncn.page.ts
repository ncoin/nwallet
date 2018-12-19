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

@IonicPage()
@Component({
    selector: 'page-buy-ncn',
    templateUrl: 'buy-ncn.page.html'
})
export class BuyNcnPage implements OnInit {
    private subsciptions: Subscription[] = [];
    public selectedWallet: NWAsset.Item;
    public assets: NWAsset.Item[];
    public buyNcnAmount: number;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private event: EventService,
        private account: AccountService,
        private logger: LoggerService,
        private currency: CurrencyService
    ) {}

    async ngOnInit() {
        this.account.registerSubjects(account => {
            this.subsciptions.push(account.assetChanged(assets => (this.assets = assets)));
        });

        this.event.RxSubscribe(NWEvent.App.change_tab, context => {
            if (context && context.index === 1) {
                this.onSelectAsset(context.currencyId);
            } else {
                this.selectedWallet = this.assets[1];
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

    public onClick_ShortCut(value: number) {
        const maxAmount = this.currency.getPrice(this.selectedWallet.getCurrencyId()) * this.selectedWallet.getAmount();
        if (value) {
            this.buyNcnAmount = Math.min(value, maxAmount);
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
