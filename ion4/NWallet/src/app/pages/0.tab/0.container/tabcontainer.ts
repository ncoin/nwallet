import { AccountProvider } from '../../../services/account/account';
import { AppServiceProvider } from '../../../services/app/app.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Logger } from '../../../services/common/logger/logger';

import { TransferHistoryTabPage } from '../1.transfer-tab/transfer-history-tab';
import { BuyNcashTabPage } from '../2.buy-ncash-tab/buy-ncash-tab';
import { WalletTabPages, WalletMainTabPage } from '../3.wallet-tab/wallet-main-tab';
import { LoanNcashTabPage } from '../4.loan-ncash-tab/loan-ncash-tab';
import { AccountTabPage } from '../5.account-tab/account-tab';
export interface TabItemContext {
    // title: "Schedule",
    // name: "TabsPage",
    component: any;
    icon: string;
    params?: any;
    // tabComponent: SchedulePage,
    // index: 0,
}

@IonicPage()
@Component({
    selector: 'page-tabcontainer',
    templateUrl: 'tabcontainer.html',
})
export class TabcontainerPage {
    selectedIndex: number;
    tabItems: TabItemContext[] = [
        {
            component: TransferHistoryTabPage,
            icon: 'nwallet-transfer',
        },
        {
            component: BuyNcashTabPage,
            icon: 'nwallet-buy',
        },
        {
            component: WalletMainTabPage,
            icon: 'nwallet-home',
        },
        {
            component: LoanNcashTabPage,
            icon: 'nwallet-loan',
        },
        {
            component: AccountTabPage,
            icon: 'nwallet-account',
        },
    ];

    constructor(public navCtrl: NavController, public navParams: NavParams, private appService: AppServiceProvider, private account: AccountProvider, private logger: Logger) {
        this.selectedIndex = 2;
    }

    chat() {}

    public changeTransition(event: any): void {
        // var index = event.index;
        // const direction = index < this.selectedIndex ? 'left' : 'right';
        // const e = event;
    }
}

export const NWalletTabPages = [TabcontainerPage, TransferHistoryTabPage, BuyNcashTabPage, LoanNcashTabPage, AccountTabPage, ...WalletTabPages];
