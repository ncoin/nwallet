import { WalletBuyPage } from './2.wallet-tab/wallet-detail/wallet-buy/wallet-buy';
import { AccountProvider } from '../../providers/account/account';
import { AppServiceProvider } from '../../providers/app/app.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TransferTabPage } from './0.transfer-tab/transfer-tab';
import { AccountTabPage } from './4.account-tab/account-tab';
import { LoanNcashTabPage } from './3.loan-ncash-tab/loan-ncash-tab';
import { WalletTabPages, WalletPage } from './2.wallet-tab/wallet-tab';
import { Logger } from '../../providers/common/logger/logger';

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
            params : { wallet: this.account.getNativeWallet() }
        },
        {
            component: WalletPage,
        },
        {
            component: LoanNcashTabPage,
        },
        {
            component: AccountTabPage,
        },
    ];

    constructor(public navCtrl: NavController, public navParams: NavParams, private appService: AppServiceProvider, private account: AccountProvider, private logger: Logger) {
        this.selectedIndex = 2;
        this.init();
    }

    private async init(): Promise<void> {
    }

    chat() {}
}

export const NWalletTabPages = [TabcontainerPage, TransferTabPage, WalletBuyPage, LoanNcashTabPage, AccountTabPage, ...WalletTabPages];
