import { MY_INFO_PAGES } from './../account/my-info/my-info.page';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Tabs } from 'ionic-angular';

import { WalletTabPages, WalletMainPage } from '../wallet-main/wallet-main.page';
import { AccountPage } from '../account/account.page';
import { ReceivePage } from '../receive/receive.page';
import { EventService } from '../../../services/common/event/event.service';
import { NWEvent } from '../../../interfaces/events';
import { LoanPage } from '../loan/loan.page';
import { BuyNcnPage, BUY_NCN_PAGES } from '../buy-ncn/buy-ncn.page';
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
    templateUrl: 'tabcontainer.html'
})
export class TabcontainerPage {
    @ViewChild(Tabs) tab: Tabs;
    selectedIndex: number;
    tabItems: TabItemContext[] = [
        {
            component: ReceivePage,
            icon: 'nwallet-receive',
            isEnable: true
        },
        {
            component: BuyNcnPage,
            icon: 'nwallet-buy',
            isEnable: true
        },
        {
            component: WalletMainPage,
            icon: 'nwallet-home',
            isEnable: true
        },
        {
            component: LoanPage,
            icon: 'nwallet-loan',
            isEnable: true
        },
        {
            component: AccountPage,
            icon: 'nwallet-account',
            isEnable: true
        }
    ];

    constructor(public navCtrl: NavController, public navParams: NavParams, private event: EventService) {
        this.selectedIndex = 2;
        this.event.RxSubscribe(NWEvent.App.change_tab, context => {
            if (context) {
                this.tab.select(context.index);
            }
        });
    }

    public changeTransition(event) {}
}

export const NWalletTabPages = [TabcontainerPage, ReceivePage, AccountPage, ...BUY_NCN_PAGES, ...WalletTabPages, ...MY_INFO_PAGES];
