import { TokenService } from './token/token.service';
import { NgModule } from '@angular/core';
import { LoggerService } from './common/logger/logger.service';
import { NWalletAppService } from './app/app.service';
import { AppConfigService } from './app/app.config.service';
import { AccountService } from './account/account.service';
import { PreferenceProvider } from './common/preference/preference';
import { NClientService } from './nsus/nclient.service';
import { LockProvider } from './common/lock/lock';
import { PlatformProvider } from './common/platform/platform';
import { EventService } from './common/event/event';
import { NsusChannelService } from './nsus/nsus-channel.service';
import { CurrencyService } from './nsus/currency.service';
import { NotificationService } from './nsus/notification.service';

@NgModule({
    providers: [
        LoggerService,
        NClientService,
        PreferenceProvider,
        AccountService,
        NWalletAppService,
        AppConfigService,
        PlatformProvider,
        LockProvider,
        TokenService,
        EventService,
        NsusChannelService,
        CurrencyService,
        NotificationService
    ],
})
export class NWalletProvidersModule {}
