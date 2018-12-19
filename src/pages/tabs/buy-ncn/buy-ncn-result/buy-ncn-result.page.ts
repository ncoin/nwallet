import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NWAsset } from '../../../../models/nwallet';
import { LoggerService } from '../../../../services/common/logger/logger.service';
import { CurrencyService } from '../../../../services/nwallet/currency.service';
import { NWConstants } from '../../../../models/constants';
@IonicPage()
@Component({
    selector: 'page-buy-ncn-result',
    templateUrl: 'buy-ncn-result.page.html'
})
export class BuyNcnResultPage implements OnInit {

    public selectedWallet: NWAsset.Item;
    public assets: NWAsset.Item[];
    public buyNcnAMount: number;
    public walletAmount: number;
    public isSuccess: boolean;
    public reason: string;

    constructor(public navCtrl: NavController, public navParams: NavParams, private logger: LoggerService, private currency: CurrencyService) {
        this.selectedWallet = navParams.get('wallet');
        this.buyNcnAMount = navParams.get('buyNcnAmount');
        this.isSuccess = navParams.get('isSuccess');

        if (this.isSuccess) {
        } else {
            this.reason = navParams.get('reason');
        }
    }

    ngOnInit(): void {
    }

    public onClick_BuyAgain(): void {}

    public async onClick_ViewHistory(): Promise<void> {}
}
