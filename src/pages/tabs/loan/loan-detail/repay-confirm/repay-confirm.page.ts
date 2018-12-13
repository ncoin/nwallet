import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { Component } from '@angular/core';
import { NWAsset } from '../../../../../models/nwallet';
import { Subscription } from 'rxjs';
import { LoggerService } from '../../../../../services/common/logger/logger.service';
import { ChannelService } from '../../../../../services/nwallet/channel.service';
import { ModalNavPage } from '../../../../base/modal-nav.page';
import { LoanRepayResultPage } from '../result/loan-repay-result.page';
import { AccountService } from '../../../../../services/account/account.service';

@IonicPage()
@Component({
    selector: 'page-repay-confirm',
    templateUrl: 'repay-confirm.page.html'
})
export class RepayConfirmPage {
    public wallet: NWAsset.Item;
    public totalLoanedAmount: number;
    public amount: number;

    private subscriptions: Subscription[] = [];
    constructor(private navCtrl: NavController, private params: NavParams, private channel: ChannelService, private account: AccountService, private loading: LoadingController) {
        this.wallet = this.params.get('wallet');
        this.amount = this.params.get('amount');
        this.totalLoanedAmount = this.wallet.Collateral.Loaned - this.amount;
        this.account.registerSubjects(accountCallback => this.subscriptions.push(accountCallback.assetChanged(this.onAssetChanged())));
    }

    ionViewDidLeave() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    public onClick_Cancel(): void {
        this.navCtrl.popToRoot();
    }

    public onAssetChanged(): (assets: NWAsset.Item[]) => void {
        return (assets: NWAsset.Item[]): void => {
            // const collaterals = assets.filter(a => a.Collateral);
            // this.totalLoanedAmount = _.sumBy(collaterals, c => c.Collateral.Loaned) + this.amount;
            this.totalLoanedAmount = this.wallet.Collateral.Loaned - this.amount;
        };
    }

    public async onClick_Confirm(): Promise<void> {
        const loading = this.loading.create({
            spinner: 'circles',
            cssClass: 'loading-base',
            dismissOnPageChange: true
        });

        loading.present();

        const result = await this.channel.requestCollateralRepay(this.wallet.Collateral.Id, this.amount);
        this.navCtrl.push(LoanRepayResultPage, {
            type: 'repay',
            result: result,
            wallet: this.wallet,
            amount: this.amount,
            totalLoanedAmount: this.totalLoanedAmount
        });
    }
}
