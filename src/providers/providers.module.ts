import { NgModule } from '@angular/core';
import { Logger } from './common/logger/logger';
import { AppServiceProvider } from './app/app.service';
import { ConfigProvider } from './app/app.config';
import { AccountProvider } from './account/account';
import { PreferenceProvider } from './common/preference/preference';
import { NClientProvider } from './nsus/nclient';
import { CurrencyProvider } from './currency/currency';
import { LockProvider } from './common/lock/lock';
import { PlatformProvider } from './common/platform/platform';

@NgModule({
    providers: [
        Logger,
        NClientProvider,
        PreferenceProvider,
        AccountProvider,
        AppServiceProvider,
        ConfigProvider,
        CurrencyProvider,
        PlatformProvider,
        LockProvider
    ],
})
export class ProvidersModule {}
