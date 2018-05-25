import { Component, ViewChild } from '@angular/core';

import { MenuController, Nav, Platform } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';

import { EntrancePage } from '../pages/0.entrance/entrance';
import { PreferenceProvider, Preference } from '../providers/common/preference/preference';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { AppServiceProvider } from '../providers/app/app.service';

export interface PageInterface {
    title: string;
    name: string;
    component: any;
    icon: string;
    logsOut?: boolean;
    index?: number;
    tabName?: string;
    tabComponent?: any;
}

@Component({
    templateUrl: 'app.template.html',
})
export class NWalletApp {
    // the root nav is a child of the root app component
    // @ViewChild(Nav) gets a reference to the app's root nav
    @ViewChild(Nav) nav: Nav;

    // List of pages that can be navigated to from the left menu
    // the left menu only works after login
    // the login page disables the left menu
    rootPage: any;
    constructor(
        public menu: MenuController,
        public platform: Platform,
        private splashScreen: SplashScreen,
        private preference: PreferenceProvider,
        private appService: AppServiceProvider,
    ) {

        this.initialize();
    }

    private async initialize(): Promise<void> {
        this.rootPage = EntrancePage;

        const hasSeenTutorial = await this.preference.get(Preference.App.hasSeenTutorial);
        if (!hasSeenTutorial) {
            this.nav.push(TutorialPage, undefined, undefined, () => {
                this.platformReady();
            });

            return;
        }

        const account = await this.preference.get(Preference.Nwallet.walletAccount);
        if (account){
            this.appService.login();
        }

        this.platformReady();
    }

    private platformReady(): void {
        this.platform.ready().then(() => {
            this.splashScreen.hide();
        });
    }

    openPage(page: PageInterface) {
        page;
        this;
    }

    openTutorial():void {
        this.nav.push(TutorialPage);
    }
}

