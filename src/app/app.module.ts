import { Clipboard } from '@ionic-native/clipboard';
import Stellar from 'stellar-sdk';
import { NWalletSharedModule } from '../shared/shared.module';
import { env } from '../environments/environment';
import { NWalletPageModule } from '../pages/pages.module';
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
import { TranslateModule, TranslateLoader, MissingTranslationHandler, MissingTranslationHandlerParams } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { QRScanner } from '@ionic-native/qr-scanner';
BootStrap();
export class MissingHandler implements MissingTranslationHandler {
    handle(params: MissingTranslationHandlerParams) {
        return `@${params.key}`;
    }
}

@NgModule({
    declarations: [NWalletApp],
    imports: [
        NWalletSharedModule,
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
            }
        ),

        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient],
            },
            useDefaultLang: true,
            missingTranslationHandler: { provide: MissingTranslationHandler, useClass: MissingHandler },
        }),
        NWalletProvidersModule,
        NWalletPageModule,
    ],
    bootstrap: [IonicApp],
    entryComponents: [NWalletApp],
    providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }, InAppBrowser, SplashScreen, FingerprintAIO, StatusBar, Vibration, Device, Clipboard, QRScanner],
})
export class AppModule {}

function BootStrap() {
    if (env.name === 'prod') {
        enableProdMode();
    }

    if (env.network === 'test') {
        // todo move location
        Stellar.Network.useTestNetwork();
    } else {
        // todo move location
        Stellar.Network.usePublicNetwork();
    }
}

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}
