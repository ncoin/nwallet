import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Component } from '@angular/core';
import { NWAsset } from '../../../../../models/nwallet';
import { Result } from '../../../../../models/api/response';
import { ResultCode } from '../../../../../interfaces/error';

@IonicPage()
@Component({
    selector: 'page-loan-repay-result',
    templateUrl: 'loan-repay-result.page.html'
})
export class LoanRepayResultPage {
    public type: 'loan' | 'repay';
    public amount: number;
    public totalLoanedAmount: number;
    public wallet: NWAsset.Item;
    public result: Result;
    public repayOptions: NWAsset.Item[] = [];
    public isSuccess: boolean;

    constructor(private navCtrl: NavController, private params: NavParams) {
        this.type = this.params.get('type');
        this.result = this.params.get('result');
        this.wallet = this.params.get('wallet');
        this.amount = this.params.get('amount');
        this.totalLoanedAmount = this.params.get('totalLoanedAmount');
        this.isSuccess = this.result.code === ResultCode.Success;
    }

    public onClick_Again() {
        this.navCtrl.removeView(this.navCtrl.getPrevious());
        this.navCtrl.pop();
    }

    public onClick_ViewHistory() {}
}
