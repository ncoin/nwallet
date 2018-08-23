import { TokenProvider } from './token/token';
import { NgModule } from '@angular/core';
import { Logger } from './common/logger/logger';
import { AppServiceProvider } from './app/app.service';
import { AppConfigProvider } from './app/app.config';
import { AccountProvider } from './account/account';
import { PreferenceProvider } from './common/preference/preference';
import { NClientProvider } from './nsus/nclient';
import { LockProvider } from './common/lock/lock';
import { PlatformProvider } from './common/platform/platform';
import { EventProvider } from './common/event/event';

@NgModule({
    providers: [
        Logger,
        NClientProvider,
        PreferenceProvider,
        AccountProvider,
        AppServiceProvider,
        AppConfigProvider,
        PlatformProvider,
        LockProvider,
        TokenProvider,
        EventProvider
    ],
})
export class NWalletProvidersModule {}
