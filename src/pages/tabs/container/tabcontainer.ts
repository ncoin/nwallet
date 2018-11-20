import { MY_INFO_PAGES } from './../account/my-info/my-info.page';
import { AccountService } from '../../../providers/account/account.service';
import { NWalletAppService } from '../../../providers/app/app.service';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Tabs } from 'ionic-angular';

import { LoggerService } from '../../../providers/common/logger/logger.service';

import { TransferHistoryPage } from '../transfer-history/transfer-history.page';
import { WalletTabPages, WalletMainPage } from '../wallet-main/wallet-main.page';
import { AccountPage } from '../account/account.page';
import { ReceivePage } from '../receive/receive.page';
import { SendPage, SEND_PAGES } from '../send/send.page';
import { EventService } from '../../../providers/common/event/event';
import { NWEvent } from '../../../interfaces/events';
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
            component: TransferHistoryPage,
            icon: 'nwallet-transfer',
            isEnable: true
        },
        {
            component: ReceivePage,
            icon: 'nwallet-buy',
            isEnable: true
        },
        {
            component: WalletMainPage,
            icon: 'nwallet-home',
            isEnable: true
        },
        {
            component: SendPage,
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

export const NWalletTabPages = [TabcontainerPage, TransferHistoryPage, ReceivePage, AccountPage, ...SEND_PAGES, ...WalletTabPages, ...MY_INFO_PAGES];
