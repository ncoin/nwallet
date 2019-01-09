import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as _ from 'lodash';
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
    private subscriptions: Subscription[] = [];
    public selectedWallet: NWAsset.Item;
    public assets: NWAsset.Item[];
    public buyNcnAmount: number;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private event: EventService,
        private account: AccountService,
        private logger: LoggerService,
        private currency: CurrencyService,
        private popup: PopupService
    ) {
    }

    async ngOnInit() {
        this.account.registerSubjects(account => {
            this.subscriptions.push(account.walletChanged(assets => (this.assets = assets)));
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
        const target = await this.popup.selectWallet(this.selectedWallet, this.assets.filter(asset => asset.getCurrencyId() !== NWConstants.NCN.currencyId));

        if (target) {
            this.selectedWallet = target;
        }
    }

    public onClick_ShortCut(value?: number) {
        const maxAmount = this.currency.getPrice(this.selectedWallet.getCurrencyId()) * this.selectedWallet.getAvailableAmount();
        const digits = 2;
        let amount = 0;
        if (value) {
            const accumAmount = this.buyNcnAmount + value;
            amount = _.min([accumAmount, maxAmount]);
        } else {
            amount = maxAmount;
        }
        this.buyNcnAmount = _.floor(amount, digits);
    }

    public onClick_Buy(): void {
        this.navCtrl.push(BuyNcnConfirmPage, {
            wallet: this.selectedWallet,
            buyNcnAmount: this.buyNcnAmount
        });
    }
}

export const BUY_NCN_PAGES = [BuyNcnPage, BuyNcnConfirmPage, BuyNcnResultPage];
