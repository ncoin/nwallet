import { LoggerService } from '../../../services/common/logger/logger.service';
import { Component } from '@angular/core';
import { NavController, LoadingController, IonicPage, ModalController } from 'ionic-angular';
import { AccountService } from '../../../services/account/account.service';
import { NWalletAppService } from '../../../services/app/app.service';
import { Subscription, Observable } from 'rxjs';
import { CurrencyService } from '../../../services/nwallet/currency.service';
import { Asset } from '../../../models/api/response';
import { NWAsset } from '../../../models/nwallet';
import { SlideHelper } from '../../../tools/helper/slide.helper';
import _ from 'lodash';
import { LoanDetailPage } from './loan-detail/loan-detail.page';
import { ModalNavPage } from '../../base/modal-nav.page';
import { LoanFormPage } from './loan-detail/loan-form/loan-form.page';
import { LoanConfirmPage } from './loan-detail/loan-confirm/loan-confirm.page';
import { RepayConfirmPage } from './loan-detail/repay-confirm/repay-confirm.page';
import { RepayFormPage } from './loan-detail/repay-form/repay-form.page';
import { LoanRepayResultPage } from './loan-detail/result/loan-repay-result.page';
import { NWConstants } from '../../../models/constants';

export interface LoanSlide {
    items: NWAsset.Item[];
}

@IonicPage()
@Component({
    selector: 'page-loan',
    templateUrl: 'loan.page.html'
})
export class LoanPage {
    public totalLoanedAmount: number;
    public totalAvailableAmount: number;

    public slides: LoanSlide[] = [];
    private subscriptions: Subscription[] = [];

    constructor(
        public navCtrl: NavController,
        private logger: LoggerService,
        private modalCtrl: ModalController,
        private account: AccountService,
        private currency: CurrencyService
    ) {}

    ionViewDidEnter() {
        this.account.registerSubjects(accountCallback => this.subscriptions.push(accountCallback.walletChanged(this.onCollateralChanged())));
    }

    ionViewDidLeave() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    public onCollateralChanged() {
        return (assets: Asset.Item[]) => {
            this.logger.debug('[loan-page] collateral changed');
            const collaterals = assets.filter(a => a.Collateral && a.CanLoan);

            this.totalLoanedAmount = _.sumBy(collaterals, c => c.Collateral.loan_sum);
            this.totalAvailableAmount = _.sumBy(collaterals, c => c.Collateral.available_loan_amout);
            this.slides = SlideHelper.getSlides(collaterals, 3);
        };
    }

    public onClick_Wallet(wallet: NWAsset.Item): void {
        const modal = this.modalCtrl.create(
            ModalNavPage,
            ModalNavPage.resolveModal(LoanDetailPage, param => {
                param.headerType = 'none';
                param.canBack = true;
                param.wallet = wallet;
            })
        );

        modal.present();
    }
}

export const LOAN_PAGES = [LoanPage, LoanDetailPage, LoanFormPage, LoanConfirmPage, RepayFormPage, RepayConfirmPage, LoanRepayResultPage];
