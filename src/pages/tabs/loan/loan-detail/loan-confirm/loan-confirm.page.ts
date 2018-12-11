import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Component, OnDestroy } from '@angular/core';

import { NWAsset } from '../../../../../models/nwallet';

import { ModalNavPage } from '../../../../base/modal-nav.page';

import { LoggerService } from '../../../../../services/common/logger/logger.service';

import { AccountService } from '../../../../../services/account/account.service';

import { ChannelService } from '../../../../../services/nwallet/channel.service';
import _ from 'lodash';
import { Subscription } from 'rxjs';
import { LoanDetailPage } from '../loan-detail.page';
import { ModalBasePage } from '../../../../base/modal.page';

@IonicPage()
@Component({
    selector: 'page-loan-confirm',
    templateUrl: 'loan-confirm.page.html'
})
export class LoanConfirmPage implements OnDestroy {
    public wallet: NWAsset.Item;
    public amount: number;
    public totalLoanedAmount: number;
    private subscriptions: Subscription[] = [];

    constructor(params: NavParams, private navCtrl: NavController, private logger: LoggerService, private account: AccountService, private channel: ChannelService) {
        this.wallet = params.get('wallet');
        this.amount = params.get('amount');
        this.account.registerSubjects(accountCallback => this.subscriptions.push(accountCallback.assetChanged(this.onAssetChanged())));
    }

    public onAssetChanged(): (assets: NWAsset.Item[]) => void {
        return (assets: NWAsset.Item[]): void => {
            const collaterals = assets.filter(a => a.Collateral);
            this.totalLoanedAmount = _.sumBy(collaterals, c => c.Collateral.loan_sum);
        };
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    public onClick_Cancel(): void {
        this.navCtrl.popToRoot();
    }

    public async onClick_Confirm(): Promise<void> {
    }
}
