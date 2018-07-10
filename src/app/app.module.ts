import { NWalletSharedModule } from './../shared/shared.module';
import { env } from './../environments/environment';
import { NWalletPageModule } from './../pages/pages.module';
import { NgModule, ErrorHandler, enableProdMode } from '@angular/core';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SplashScreen } from '@ionic-native/splash-screen';

import { IonicStorageModule } from '@ionic/storage';

import { NWalletApp } from './app.component';

import { NWalletProvidersModule } from '../providers/providers.module';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';
import { StatusBar } from '@ionic-native/status-bar';
import { Vibration } from '@ionic-native/vibration';
import { Device } from '@ionic-native/device';
BootStrap();
@NgModule({
    declarations: [NWalletApp],
    imports: [
        NWalletSharedModule,
        NWalletProvidersModule,
        NWalletPageModule,
        IonicStorageModule.forRoot(),
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
    ],
    bootstrap: [IonicApp],
    entryComponents: [NWalletApp],
    providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }, InAppBrowser, SplashScreen, FingerprintAIO, StatusBar, Vibration, Device],
})
export class AppModule {}

function BootStrap() {
    if (env.name === 'prod' || env.name === 'stage') {
        enableProdMode();
    }
}
