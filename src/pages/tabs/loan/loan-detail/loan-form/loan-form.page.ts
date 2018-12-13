import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams } from 'ionic-angular';
import { NWAsset } from '../../../../../models/nwallet';
import { Subscription } from 'rxjs';
import { LoanConfirmPage } from '../loan-confirm/loan-confirm.page';
import { LoggerService } from '../../../../../services/common/logger/logger.service';

@IonicPage()
@Component({
    selector: 'page-loan-form',
    templateUrl: 'loan-form.page.html'
})
export class LoanFormPage {
    public wallet: NWAsset.Item;
    public amount: number;
    private subscriptions: Subscription[] = [];

    public isTermAgreed = false;
    constructor(private navCtrl: NavController, params: NavParams, private logger: LoggerService) {
        this.wallet = params.get('wallet');
    }

    public onCollateralChanged() {}

    async ionViewDidEnter() {}

    ionViewDidLeave() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    public onClick_Loan(): void {
        this.logger.debug('[loan-form-page] navate to :', LoanConfirmPage.name);
        this.navCtrl.push(LoanConfirmPage, { wallet: this.wallet, amount: Number.parseFloat(this.amount.toString()) });
    }
}
