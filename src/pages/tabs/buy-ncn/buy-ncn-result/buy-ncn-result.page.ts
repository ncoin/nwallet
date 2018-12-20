import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NWAsset } from '../../../../models/nwallet';
import { LoggerService } from '../../../../services/common/logger/logger.service';
import { CurrencyService } from '../../../../services/nwallet/currency.service';
import { NWConstants } from '../../../../models/constants';
import { AccountService } from '../../../../services/account/account.service';
@IonicPage()
@Component({
    selector: 'page-buy-ncn-result',
    templateUrl: 'buy-ncn-result.page.html'
})
export class BuyNcnResultPage implements OnInit {
    public selectedWallet: NWAsset.Item;
    public assets: NWAsset.Item[];
    public ncn: NWAsset.Item;
    public buyNcnAmount: number;
    public usedAmount: number;
    public afterAmount: number;
    public isSuccess: boolean;
    public reason: string;

    constructor(public navCtrl: NavController, public navParams: NavParams, private account: AccountService, private logger: LoggerService, private currency: CurrencyService) {
        this.selectedWallet = navParams.get('wallet');
        this.buyNcnAmount = navParams.get('buyNcnAmount');
        this.usedAmount = navParams.get('usedAmount');
        this.afterAmount = navParams.get('afterAmount');
        this.isSuccess = navParams.get('isSuccess');

        if (this.isSuccess) {
        } else {
            this.reason = navParams.get('reason');
        }
    }

    async ngOnInit(): Promise<void> {
        this.ncn = await this.account.detail().then(a =>
            a.inventory
                .getAssetItems()
                .getValue()
                .find(wallet => wallet.getCurrencyId() === NWConstants.NCN.currencyId)
        );
    }

    public onClick_BuyAgain(): void {
        this.navCtrl.popToRoot();
    }

    public async onClick_ViewHistory(): Promise<void> {
        // todo wallet detail page;
    }
}
