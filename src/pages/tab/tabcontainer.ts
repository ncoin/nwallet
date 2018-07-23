import { WalletBuyPage } from './2.buy-ncash-tab/wallet-buy';
import { AccountProvider } from '../../providers/account/account';
import { AppServiceProvider } from '../../providers/app/app.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AccountTabPage } from './5.account-tab/account-tab';
import { WalletTabPages, WalletPage } from './3.wallet-tab/wallet-tab';
import { Logger } from '../../providers/common/logger/logger';
import { WalletLoanPage } from './4.loan-ncash-tab/wallet-loan';
import { TransferTabPage } from './1.transfer-tab/transfer-tab';

export interface TabItemContext {
    // title: "Schedule",
    // name: "TabsPage",
    component: any;
    params?: any;
    // tabComponent: SchedulePage,
    // index: 0,
    // icon: "calendar"
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
            component: TransferTabPage,
        },
        {
            component: WalletBuyPage,
        },
        {
            component: WalletPage,
        },
        {
            component: WalletLoanPage,
        },
        {
            component: AccountTabPage,
        },
    ];

    constructor(public navCtrl: NavController, public navParams: NavParams, private appService: AppServiceProvider, private account: AccountProvider, private logger: Logger) {
        this.selectedIndex = 2;
        this.account;
    }

    chat() {
        this.appService;
        this.logger;
    }

    public changeTransition(event: any): void {
        event;
        // var index = event.index;
        // const direction = index < this.selectedIndex ? 'left' : 'right';
        // const e = event;
    }
}

export const NWalletTabPages = [TabcontainerPage, TransferTabPage, WalletBuyPage, WalletLoanPage, AccountTabPage, ...WalletTabPages];
