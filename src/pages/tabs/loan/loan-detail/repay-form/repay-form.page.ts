import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Component } from '@angular/core';
import { NWAsset } from '../../../../../models/nwallet';
import { RepayConfirmPage } from '../repay-confirm/repay-confirm.page';

@IonicPage()
@Component({
    selector: 'page-repay-form',
    templateUrl: 'repay-form.page.html'
})
export class RepayFormPage {
    public amount: string;
    public wallet: NWAsset.Item;
    public repayOptions: NWAsset.Item[] = [];

    constructor(private navCtrl: NavController, private params: NavParams) {
        this.wallet = this.params.get('wallet');
    }

    public async onClick_Repay(): Promise<void> {
        this.navCtrl.push(RepayConfirmPage, { wallet: this.wallet, amount: Number.parseFloat(this.amount) });
    }
}
