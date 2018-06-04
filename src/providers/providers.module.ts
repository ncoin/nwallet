import { NgModule } from '@angular/core';
import { Logger } from './common/logger/logger';
import { AppServiceProvider } from './app/app.service';
import { ConfigProvider } from './app/app.config';
import { AccountProvider } from './account/account';
import { PreferenceProvider } from './common/preference/preference';
import { NClientProvider } from './nsus/nclient';
import { CurrencyProvider } from './currency/currency';

@NgModule({
    providers: [
        Logger,
        NClientProvider,
        PreferenceProvider,
        AccountProvider,
        AppServiceProvider,
        ConfigProvider,
        CurrencyProvider
    ],
})
export class ProvidersModule {}
