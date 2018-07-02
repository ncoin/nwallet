import { env } from './../environments/environment';
import { NWalletPageModule } from './../pages/pages.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler, enableProdMode } from '@angular/core';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SplashScreen } from '@ionic-native/splash-screen';

import { IonicStorageModule } from '@ionic/storage';

import { NWalletApp } from './app.component';

import { ProvidersModule } from '../providers/providers.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';
import { StatusBar } from '@ionic-native/status-bar';
import { Vibration } from '@ionic-native/vibration';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
BootStrap();
@NgModule({
    declarations: [NWalletApp],
    imports: [
        BrowserModule,
        HttpClientModule,
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
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient],
            },
        }),
    ],
    bootstrap: [IonicApp],
    entryComponents: [NWalletApp],
    providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }, InAppBrowser, SplashScreen, FingerprintAIO, StatusBar, Vibration],
})
export class AppModule {}

function BootStrap() {
    if (env.name === 'prod' || env.name === 'stage') {
        enableProdMode();
    }
}

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
