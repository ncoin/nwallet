import { BuyNcashTabPage } from './1.buy-ncash-tab/buy-ncash-tab';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TransferTabPage } from './0.transfer-tab/transfer-tab';
import { AccountTabPage } from './5.account-tab/account-tab';
import { LoanNcashTabPage } from './3.loan-ncash-tab/loan-ncash-tab';
import { WalletTabPages, WalletPage } from './2.wallet-tab/wallet-tab';

/**
 * Generated class for the TabcontainerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
export interface WalletTabContext {
    // title: "Schedule",
    // name: "TabsPage",
    component: any;
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
    tabItems: WalletTabContext[] = [
        {
            component: TransferTabPage,
        },
        {
            component: BuyNcashTabPage,
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

    constructor(public navCtrl: NavController, public navParams: NavParams) {
        this.selectedIndex = 2;
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad TabcontainerPage');
    }
}

export const NWalletTabPages = [TabcontainerPage, TransferTabPage, BuyNcashTabPage, LoanNcashTabPage, AccountTabPage, ...WalletTabPages];
