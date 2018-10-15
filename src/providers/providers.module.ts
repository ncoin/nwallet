import { TokenProvider } from './token/token';
import { NgModule } from '@angular/core';
import { LoggerService } from './common/logger/logger.service';
import { NWalletAppService } from './app/app.service';
import { AppConfigProvider } from './app/app.config';
import { AccountService } from './account/account.service';
import { PreferenceProvider } from './common/preference/preference';
import { NClientProvider } from './nsus/nclient';
import { LockProvider } from './common/lock/lock';
import { PlatformProvider } from './common/platform/platform';
import { EventProvider } from './common/event/event';
import { NsusChannelService } from './nsus/nsus-channel.service';
import { CurrencyService } from './nsus/currency.service';
import { NotificationService } from './nsus/notification';

@NgModule({
    providers: [
        LoggerService,
        NClientProvider,
        PreferenceProvider,
        AccountService,
        NWalletAppService,
        AppConfigProvider,
        PlatformProvider,
        LockProvider,
        TokenProvider,
        EventProvider,
        NsusChannelService,
        CurrencyService,
        NotificationService
    ],
})
export class NWalletProvidersModule {}
