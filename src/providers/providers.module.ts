import { NgModule } from '@angular/core';
import { Logger } from './common/logger/logger';
import { AppServiceProvider } from './app/app.service';
import { ConfigProvider } from './app/app.config';
import { AccountProvider } from './account/account';
import { PreferenceProvider } from './common/preference/preference';
import { ConnectProvider } from './nsus/connector';

@NgModule({
    providers: [
        Logger,
        ConnectProvider,
        PreferenceProvider,
        AccountProvider,
        AppServiceProvider,
        ConfigProvider,
    ],
})
export class ProvidersModule {}
