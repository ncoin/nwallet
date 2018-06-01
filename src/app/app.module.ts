import { NWalletPageModule } from './../pages/pages.module';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule, ErrorHandler } from '@angular/core';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SplashScreen } from '@ionic-native/splash-screen';

import { IonicStorageModule } from '@ionic/storage';

import { NWalletApp } from './app.component';


import { ProvidersModule } from '../providers/providers.module';

@NgModule({
    declarations: [
        NWalletApp,
    ],
    imports: [
        BrowserModule,
        HttpModule,
        NWalletPageModule,
        IonicModule.forRoot(
            NWalletApp,
            {},
            {
                links: [
                    // {
                    //     component: EntrancePage,
                    //     name: 'EntrancePage',
                    //     segment: 'entrance',
                    // },
                    // {
                    //     component: CreateAccountPage,
                    //     name: 'CreateAccountPage',
                    //     segment: 'createaccount',
                    // },
                    // {
                    //     component: ImportAccountPage,
                    //     name: 'ImportAccountPage',
                    //     segment: 'importaccount',
                    // },
                    // {
                    //     component: WalletPage,
                    //     name: 'WalletPage',
                    //     segment: 'wallet'
                    // }
                ],
            },
        ),
        IonicStorageModule.forRoot(),
        ProvidersModule,
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        NWalletApp,
    ],
    providers: [
        { provide: ErrorHandler, useClass: IonicErrorHandler },
        InAppBrowser,
        SplashScreen,
    ],
})
export class AppModule {}
