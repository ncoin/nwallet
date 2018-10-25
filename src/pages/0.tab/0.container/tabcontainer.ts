import { MyInfoPage } from './../5.account-tab/my-info/my-info.page';
import { AccountService } from '../../../providers/account/account.service';
import { NWalletAppService } from '../../../providers/app/app.service';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Tabs, Tab } from 'ionic-angular';

import { LoggerService } from '../../../providers/common/logger/logger.service';

import { TransferHistoryTabPage } from '../1.transfer-tab/transfer-history-tab';
import { WalletTabPages, WalletMainTabPage } from '../3.wallet-tab/wallet-main-tab';
import { AccountTabPage } from '../5.account-tab/account-tab.page';
import { ReceivePage } from '../receive/receive.page';
import { SendPage } from '../1.transfer-tab/send/send.page';
import { LanguagePage } from '../5.account-tab/language/language.page';
import { ResetPincodePage } from '../5.account-tab/my-info/reset-pincode/reset-pincode.page';
import { ResetPincodeSuccessPage } from '../5.account-tab/my-info/reset-pincode-success/reset-pincode-success.page';
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
            component: TransferHistoryTabPage,
            icon: 'nwallet-transfer',
            isEnable: true
        },
        {
            component: ReceivePage,
            icon: 'nwallet-buy',
            isEnable: true
        },
        {
            component: WalletMainTabPage,
            icon: 'nwallet-home',
            isEnable: true
        },
        {
            component: SendPage,
            icon: 'nwallet-loan',
            isEnable: true
        },
        {
            component: AccountTabPage,
            icon: 'nwallet-account',
            isEnable: true
        }
    ];

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private appService: NWalletAppService,
        private account: AccountService,
        private logger: LoggerService,
        private event: EventService
    ) {
        this.selectedIndex = 2;
        this.event.RxSubscribe(NWEvent.App.change_tab, context => {
            if (context) {
                this.tab.select(context.index);
            }
        });
    }

    chat() {}

    public changeTransition(event: any): void {
        // var index = event.index;
        // const direction = index < this.selectedIndex ? 'left' : 'right';
        // const e = event;
    }
}

export const NWalletTabPages = [
    TabcontainerPage,
    TransferHistoryTabPage,
    ReceivePage,
    AccountTabPage,
    ...WalletTabPages,
    ...[MyInfoPage, LanguagePage, ResetPincodePage, ResetPincodeSuccessPage]
];
