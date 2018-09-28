import { TokenProvider } from './token/token';
import { NgModule } from '@angular/core';
import { LoggerService } from './common/logger/logger.service';
import { AppServiceProvider } from './app/app.service';
import { AppConfigProvider } from './app/app.config';
import { AccountService } from './account/account.service';
import { PreferenceProvider } from './common/preference/preference';
import { NClientProvider } from './nsus/nclient';
import { LockProvider } from './common/lock/lock';
import { PlatformProvider } from './common/platform/platform';
import { EventProvider } from './common/event/event';

@NgModule({
    providers: [
        LoggerService,
        NClientProvider,
        PreferenceProvider,
        AccountService,
        AppServiceProvider,
        AppConfigProvider,
        PlatformProvider,
        LockProvider,
        TokenProvider,
        EventProvider
    ],
})
export class NWalletProvidersModule {}
