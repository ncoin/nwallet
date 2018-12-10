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

export interface LoanSlide {
    items: NWAsset.Item[];
}

@IonicPage()
@Component({
    selector: 'page-loan',
    templateUrl: 'loan.page.html'
})
export class LoanPage {
    public totalLoaned: number;
    public totalAvailable: number;

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
        this.account.registerSubjects(accountCallback => this.subscriptions.push(accountCallback.assetChanged(this.onColleteralChanged())));
    }

    ionViewDidLeave() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    public onColleteralChanged() {
        return (assets: Asset.Item[]) => {
            this.logger.debug('[loan-page] colleteral changed');
            const colleterals = assets.filter(a => a.Colleteral);

            // for development
            colleterals.push(...colleterals, ...colleterals, ...colleterals);
            this.totalLoaned = _.sumBy(colleterals, c => c.Colleteral.loan_sum);
            this.totalAvailable = _.sumBy(colleterals, c => c.Colleteral.available_loan_amout);
            this.slides = SlideHelper.getSlides(colleterals, 3);
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

export const LOAN_PAGES = [LoanPage, LoanDetailPage, LoanFormPage, LoanConfirmPage, RepayFormPage, RepayConfirmPage];
