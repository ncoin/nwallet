import { Subscription } from 'rxjs/Subscription';
import { NWEvent } from '../interfaces/events';
import { EventService } from '../services/common/event/event';
import { NWalletAppService } from '../services/app/app.service';
import { TabcontainerPage } from '../pages/tabs/container/tabcontainer';
import { AccountService } from '../services/account/account.service';
import { LockProvider } from '../services/common/lock/lock';

import { LoggerService } from '../services/common/logger/logger.service';
import { Component, ViewChild, OnDestroy } from '@angular/core';

import { Nav, Platform } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { EntrancePage } from '../pages/entrance/entrance.page';
import { AppConfigService } from '../services/app/app.config.service';

@Component({
    templateUrl: 'app.template.html'
})
// tslint:disable-next-line:component-class-suffix
export class NWalletApp implements OnDestroy {
    // the root nav is a child of the root app component
    // @ViewChild(Nav) gets a reference to the app's root nav
    @ViewChild(Nav)
    nav: Nav;
    private resumeSubscription: Subscription;
    // List of pages that can be navigated to from the left menu
    // the left menu only works after login
    // the login page disables the left menu
    rootPage: any;
    constructor(
        public platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private logger: LoggerService,
        private lock: LockProvider,
        private account: AccountService,
        private appConfig: AppConfigService,
        private app: NWalletAppService,
        private event: EventService
    ) {
        this.initialize();
    }

    private initialize(): void {
        this.platform
            .ready()
            .then(() => {
                this.statusBar.overlaysWebView(false);
                this.statusBar.backgroundColorByHexString('#000');
                this.statusBar.styleLightContent();

                this.logger.debug('[app-page] prepare platform');
                this.onPlatformReady();
            })
            .catch(error => {
                this.logger.debug('[app-page] prepare platform failed.', error);
            });
    }

    private async onPlatformReady(): Promise<void> {
        this.subscribeEvents();
        await Promise.all([this.appConfig.loadAll(), this.preparePage()]);
        this.prepareSecurity();
        this.logger.debug('[app-page] platform on ready');
        this.splashScreen.hide();
    }

    private subscribeEvents(): void {
        this.event.subscribe(NWEvent.App.user_login, context => {
            this.rootPage = TabcontainerPage;
        });
        this.event.subscribe(NWEvent.App.user_logout, () => {
            this.rootPage = EntrancePage;
        });
    }

    private async preparePage(): Promise<void> {
        const userName = await this.app.canLogin();
        if (userName) {
            this.logger.debug('[app-page] prepare wallet page (login)');
            this.app.enter(userName);
        } else {
            this.logger.debug('[app-page] prepare entrance page');
            this.rootPage = EntrancePage;
        }

        // const hasSeenTutorial = await this.appConfig.hasSeenTutorial();
        // if (!hasSeenTutorial) {
        //     this.logger.debug('[app-page] prepare tutorial page');
        //     this.nav.push(TutorialPage, undefined, undefined, () => {});
        //     return;
        // }
    }

    private prepareSecurity(): void {
        // todo persistence --sky`
        this.resumeSubscription = this.platform.resume.subscribe(() => {
            this.lock.tryLockModalOpen();
        });

        this.lock.tryLockModalOpen();
    }

    ngOnDestroy(): void {
        this.resumeSubscription.unsubscribe();
    }
}
