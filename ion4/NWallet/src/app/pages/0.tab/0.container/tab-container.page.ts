import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { TransferHistoryTabPage } from '$pages/0.tab/1.transfer-tab/transfer-history-tab';
import { BuyNcashTabPage } from '$pages/0.tab/2.buy-ncash-tab/buy-ncash-tab';
import { WalletTabPages, WalletMainTabPage } from '$pages/0.tab/3.wallet-tab/wallet-main-tab';
import { LoanNcashTabPage } from '$pages/0.tab/4.loan-ncash-tab/loan-ncash-tab';
import { AccountTabPage } from '$pages/0.tab/5.account-tab/account-tab';
import { ReceivePage } from '$pages/0.tab/1.transfer-tab/receive/receive.page';
import { SendPage } from '$pages/0.tab/1.transfer-tab/send/send.page';
import { NWalletService } from '$services/app/nwallet.service';
import { AccountService } from '$services/app/account/account.service';
import { LoggerService } from '$services/cores/logger/logger.service';
export interface TabItemContext {
    // title: "Schedule",
    // name: "TabsPage",
    component: any;
    icon: string;
    params?: any;
    isEnable: boolean;
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
            isEnable: true,
        },
        {
            component: ReceivePage,
            icon: 'nwallet-buy',
            isEnable: true,
        },
        {
            component: WalletMainTabPage,
            icon: 'nwallet-home',
            isEnable: true,
        },
        {
            component: SendPage,
            icon: 'nwallet-loan',
            isEnable: true,
        },
        {
            component: AccountTabPage,
            icon: 'nwallet-account',
            isEnable: true,
        },
    ];

    constructor(public navCtrl: NavController, public navParams: NavParams, private appService: NWalletService, private account: AccountService, private logger: LoggerService) {
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
