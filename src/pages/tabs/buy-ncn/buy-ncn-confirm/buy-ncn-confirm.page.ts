import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { NWAsset } from '../../../../models/nwallet';
import { LoggerService } from '../../../../services/common/logger/logger.service';
import { CurrencyService } from '../../../../services/nwallet/currency.service';
import { NWConstants } from '../../../../models/constants';
import { ChannelService } from '../../../../services/nwallet/channel.service';
import { ResultCode } from '../../../../interfaces/error';
import { BuyNcnResultPage } from '../buy-ncn-result/buy-ncn-result.page';
@IonicPage()
@Component({
    selector: 'page-buy-ncn-confirm',
    templateUrl: 'buy-ncn-confirm.page.html'
})
export class BuyNcnConfirmPage implements OnInit {
    public selectedWallet: NWAsset.Item;
    public assets: NWAsset.Item[];
    public buyNcnAmount: number;
    public walletAmount: number;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private channel: ChannelService,
        private logger: LoggerService,
        private currency: CurrencyService,
        private loading: LoadingController
    ) {
        this.selectedWallet = navParams.get('wallet');
        this.buyNcnAmount = navParams.get('buyNcnAmount');
    }

    async ngOnInit() {
        const ncn = this.currency.get(NWConstants.NCN.currencyId).getValue();
        this.walletAmount = this.buyNcnAmount / this.currency.getPrice(this.selectedWallet.getCurrencyId());
    }

    public onClick_Cancel(): void {
        this.navCtrl.pop();
    }

    public async onClick_Confirm(): Promise<void> {
        const loading = this.loading.create({
            spinner: 'circles',
            cssClass: 'loading-base',
            dismissOnPageChange: true
        });
        loading.present();
        const result = await this.channel.buyNcn(this.selectedWallet.getWalletId(), this.buyNcnAmount);
        if (result.code === ResultCode.Success) {
            this.navCtrl.push(BuyNcnResultPage, {
                isSuccess: true,
                wallet: this.selectedWallet,
                buyNcnAmount: this.buyNcnAmount,
                usedAmount: this.walletAmount,
                afterAmount: this.selectedWallet.getAmount() - this.walletAmount
            });
        } else {
            this.navCtrl.push(BuyNcnResultPage, {
                isSuccess: false,
                reason: result.reason
            });
        }
    }
}
