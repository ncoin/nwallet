import { Clipboard } from '@ionic-native/clipboard';
import { NWalletSharedModule } from '../shared/shared.module';
import { env } from '../environments/environment';
import { NWalletPageModule } from '../pages/pages.module';
import { NgModule, ErrorHandler, enableProdMode } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler, Config } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage';
import { NWalletApp } from './app.component';
import { NWalletProvidersModule } from '../services/services.module';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';
import { StatusBar } from '@ionic-native/status-bar';
import { Vibration } from '@ionic-native/vibration';
import { Device } from '@ionic-native/device';
import { TranslateModule, TranslateLoader, MissingTranslationHandler, MissingTranslationHandlerParams } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { QRScanner } from '@ionic-native/qr-scanner';
import { NWPageTransitions } from '../transitions';
import { NWStellar } from '../models/stellar/stellar';
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
                    //     component: ImportAccountPage,
                    //     name: 'ImportAccountPage',
                    //     segment: 'importaccount',
                    // },
                    // {
                    //     component: WalletPage,
                    //     name: 'WalletPage',
                    //     segment: 'wallet'
                    // }
                ]
            }
        ),

        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            },
            useDefaultLang: true,
            missingTranslationHandler: {
                provide: MissingTranslationHandler,
                useClass: MissingHandler
            }
        }),
        NWalletProvidersModule,
        NWalletPageModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [NWalletApp],
    providers: [
        { provide: ErrorHandler, useClass: IonicErrorHandler },
        // native plugins
        ...[InAppBrowser, SplashScreen, FingerprintAIO, StatusBar, Vibration, Device, Clipboard, QRScanner, ScreenOrientation]
    ]
})
export class AppModule {
    constructor(config: Config) {
        if (env.name === 'dev') {
            NWPageTransitions.transitions.forEach(transition => {
                config.setTransition(transition.NAME, transition);
            });

            NWStellar.Network.useTestNetwork();
        }

        if (env.name === 'stage') {
            NWStellar.Network.useTestNetwork();
        }

        if (env.name === 'prod') {
            NWStellar.Network.usePublicNetwork();
        }
    }
}

function BootStrap() {
    if (env.name === 'prod') {
        enableProdMode();
    }
}

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}
