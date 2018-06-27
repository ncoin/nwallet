import { LockProvider } from './../providers/common/lock/lock';
import { Subscription } from 'rxjs/Rx';
import { WalletPage } from './../pages/wallet/wallet';
import { Logger } from './../providers/common/logger/logger';
import { Component, ViewChild } from '@angular/core';

import { MenuController, Nav, Platform } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';

import { EntrancePage } from '../pages/0.entrance/entrance';
import { PreferenceProvider, Preference } from '../providers/common/preference/preference';
import { TutorialPage } from '../pages/tutorial/tutorial';

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
    private resumeSubscription: Subscription;
    // List of pages that can be navigated to from the left menu
    // the left menu only works after login
    // the login page disables the left menu
    rootPage: any;
    constructor(
        public menu: MenuController,
        public platform: Platform,
        private splashScreen: SplashScreen,
        private preference: PreferenceProvider,
        private logger: Logger,
        private lock: LockProvider,
    ) {
        this.logger.debug('app start');
        this.initialize();
    }

    private async initialize(): Promise<void> {

        const account = await this.preference.get(Preference.Nwallet.walletAccount);
        if (account) {
            this.rootPage = WalletPage;
        } else {
            this.rootPage = EntrancePage;
        }


        const hasSeenTutorial = await this.preference.get(Preference.App.hasSeenTutorial);
        if (!hasSeenTutorial) {
            this.nav.push(TutorialPage, undefined, undefined, () => {
                this.platformReady();
            });

            return;
        }

        this.platformReady();
    }

    private platformReady(): void {

        this.logger.info('prepare platform');

        this.platform.ready().then(() => {
            this.onPlatformReady();
        });
    }

    private async onPlatformReady(): Promise<void> {
        // todo load app services
        this.resumeSubscription = this.platform.resume.subscribe(() => {
            this.openResumeModal();
        });

        this.openResumeModal();

        this.splashScreen.hide();

        this.logger.info('platform ready');
    }

    openPage(page: PageInterface) {
        page;
        this;
    }

    private openResumeModal(): void {
        this.lock.tryLockModalOpen();
    }

    ngOnDestroy(): void {
        this.resumeSubscription.unsubscribe();
    }

    openTutorial(): void {
        this.nav.push(TutorialPage, undefined, {
            animate: true,
            animation: 'ios-transition',
        });
    }
}
