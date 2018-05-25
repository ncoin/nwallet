import { WalletPage } from './../pages/0.main/wallet';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule, ErrorHandler } from '@angular/core';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SplashScreen } from '@ionic-native/splash-screen';

import { IonicStorageModule } from '@ionic/storage';

import { NWalletApp } from './app.component';


import { TutorialPage } from '../pages/tutorial/tutorial';

import { ProvidersModule } from '../providers/providers.module';
import { EntrancePage } from '../pages/0.entrance/entrance';
import { CreateAccountPage } from '../pages/createaccount/createaccount';

@NgModule({
    declarations: [
        NWalletApp,

        TutorialPage,
        EntrancePage,
        CreateAccountPage,
        WalletPage,
    ],
    imports: [
        BrowserModule,
        HttpModule,
        IonicModule.forRoot(
            NWalletApp,
            {},
            {
                links: [
                    {
                        component: EntrancePage,
                        name: 'EntrancePage',
                        segment: 'entrance',
                    },
                    {
                        component: CreateAccountPage,
                        name: 'CreateAccountPage',
                        segment: 'createaccount',
                    },
                    {
                        component: WalletPage,
                        name: 'WalletPage',
                        segment: 'wallet'
                    }
                ],
            },
        ),
        IonicStorageModule.forRoot(),
        ProvidersModule,
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        NWalletApp,
        TutorialPage,
        EntrancePage,
        WalletPage,
        CreateAccountPage
    ],
    providers: [
        { provide: ErrorHandler, useClass: IonicErrorHandler },
        InAppBrowser,
        SplashScreen,
    ],
})
export class AppModule {}
