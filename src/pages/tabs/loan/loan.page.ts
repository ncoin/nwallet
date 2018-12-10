import { LoggerService } from '../../../services/common/logger/logger.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController, ModalController, LoadingController, Loading, IonicPage } from 'ionic-angular';
import { AccountService } from '../../../services/account/account.service';
import { NWalletAppService } from '../../../services/app/app.service';
import { Subscription, Observable } from 'rxjs';
import { CurrencyService } from '../../../services/nwallet/currency.service';
import _ from 'lodash';
import { Debug } from '../../../utils/helper/debug';
import { Asset } from '../../../models/api/response';
import { NWAsset } from '../../../models/nwallet';
import { SlideHelper } from '../../../tools/helper/slide.helper';

export interface LoanSlide {
    items: NWAsset.Item[];
}

@IonicPage()
@Component({
    selector: 'page-loan',
    templateUrl: 'loan.page.html'
})
export class LoanPage implements OnInit {
    public totalLoaned: number;
    public totalAvailable: number;

    public slides: LoanSlide[] = [];
    private subscriptions: Subscription[] = [];
    private loading: Loading;

    constructor(
        public navCtrl: NavController,
        private logger: LoggerService,
        private modalCtrl: ModalController,
        public loadingCtrl: LoadingController,
        private app: NWalletAppService,
        private account: AccountService,
        private currency: CurrencyService
    ) {}

    public onColleteralChanged() {
        return (assets: Asset.Item[]) => {
            const colleterals = assets.filter(a => a.Colleteral);
            colleterals.push(...colleterals, ...colleterals, ...colleterals);
            this.totalLoaned = _.sumBy(colleterals, c => c.Colleteral.loan_sum);
            this.totalAvailable = _.sumBy(colleterals, c => c.Colleteral.available_loan_amout);
            this.slides = SlideHelper.getSlides(colleterals, 3);
        };
    }

    public ngOnInit(): void {}

    ionViewDidEnter() {
        this.account.registerSubjects(a => {
            this.subscriptions.push(a.assetChanged(this.onColleteralChanged()));
        });
    }

    ionViewDidLeave() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }
}
