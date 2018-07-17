import { TabcontainerPage } from '../pages/tab/tabcontainer';
import { AccountProvider } from '../providers/account/account';
import { LockProvider } from '../providers/common/lock/lock';
import { Subscription } from 'rxjs';
import { Logger } from '../providers/common/logger/logger';
import { Component, ViewChild } from '@angular/core';

import { Nav, Platform } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';

import { EntrancePage } from '../pages/0.entrance/entrance';
import { TutorialPage } from '../pages/etc.tutorial/tutorial';
import { AppConfigProvider } from '../providers/app/app.config';

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
        public platform: Platform,
        private splashScreen: SplashScreen,
        private logger: Logger,
        private lock: LockProvider,
        private account: AccountProvider,
        private appConfig: AppConfigProvider,
    ) {
        this.initialize();
    }

    private initialize(): void {
        this.platform
            .ready()
            .then(() => {
                this.logger.debug('[app-page] prepare platform');
                this.onPlatformReady();
            })
            .catch(error => {
                this.logger.debug('[app-page] prepare platform failed.', error);
            });
    }

    private async onPlatformReady(): Promise<void> {
        await this.appConfig.loadAll();
        await this.preparePage();
        this.prepareSecurity();
        this.logger.debug('[app-page] platform ready now');
        this.splashScreen.hide();
    }

    private async preparePage(): Promise<void> {
        const account = await this.account.getAccount();
        if (account) {
            this.logger.debug('[app-page] prepare wallet page');
            this.rootPage = TabcontainerPage;
        } else {
            this.logger.debug('[app-page] prepare entrance page');
            this.rootPage = EntrancePage;
        }

        const hasSeenTutorial = await this.appConfig.hasSeenTutorial();
        if (!hasSeenTutorial) {
            this.logger.debug('[app-page] prepare tutorial page');
            this.nav.push(TutorialPage, undefined, undefined, () => {});
            return;
        }
    }

    private prepareSecurity(): void {
        this.resumeSubscription = this.platform.resume.subscribe(() => {
            this.lock.tryLockModalOpen();
        });

        this.lock.tryLockModalOpen();
    }

    ngOnDestroy(): void {
        this.resumeSubscription.unsubscribe();
    }
}
