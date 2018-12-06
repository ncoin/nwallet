import { AuthorizationService } from './nwallet/authorization.service';
import { NgModule } from '@angular/core';
import { LoggerService } from './common/logger/logger.service';
import { NWalletAppService } from './app/app.service';
import { AppConfigService } from './app/app.config.service';
import { AccountService } from './account/account.service';
import { PreferenceProvider } from './common/preference/preference';
import { NetworkService } from './nwallet/network.service';
import { LockProvider } from './common/lock/lock';
import { PlatformService } from './common/platform/platform.service';
import { EventService } from './common/event/event';
import { ChannelService } from './nwallet/channel.service';
import { CurrencyService } from './nwallet/currency.service';
import { NotificationService } from './nwallet/notification.service';
import { PopupService } from './popup/popop.service';

@NgModule({
    providers: [
        LoggerService,
        NetworkService,
        PreferenceProvider,
        AccountService,
        NWalletAppService,
        AppConfigService,
        PlatformService,
        LockProvider,
        AuthorizationService,
        EventService,
        ChannelService,
        CurrencyService,
        NotificationService,
        PopupService
    ]
})
export class NWalletProvidersModule {}
