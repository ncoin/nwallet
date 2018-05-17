import { NgModule } from '@angular/core';
import { Logger } from './common/logger/logger';
import { AppConfigProvider } from './app/app';
import { ConfigProvider } from './app/config';
import { AccountProvider } from './account/account';
import { StorageProvider } from './common/storage/storage';

@NgModule({
    providers: [
        Logger,
        AppConfigProvider,
        ConfigProvider,
        AccountProvider,
        StorageProvider,
    ],
})
export class ProvidersModule {}
