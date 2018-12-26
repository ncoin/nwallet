import { AuthorizationService } from './nwallet/authorization.service';
import { NgModule } from '@angular/core';
import { LoggerService } from './common/logger/logger.service';
import { NWalletAppService } from './app/app.service';
import { AppConfigService } from './app/app.config.service';
import { AccountService } from './account/account.service';
import { PreferenceService } from './common/preference/preference.service';
import { NetworkService } from './nwallet/network.service';
import { LockService } from './common/lock/lock.service';
import { PlatformService } from './common/platform/platform.service';
import { EventService } from './common/event/event.service';
import { ChannelService } from './nwallet/channel.service';
import { CurrencyService } from './nwallet/currency.service';
import { NotificationService } from './nwallet/notification.service';
import { PopupService } from './popup/popop.service';
import { PushServiceBase } from './common/push/push.service';
import { FirebasePushService } from './common/push/firebase.push.service';

@NgModule({
    providers: [
        LoggerService,
        NetworkService,
        PreferenceService,
        AccountService,
        NWalletAppService,
        AppConfigService,
        PlatformService,
        LockService,
        AuthorizationService,
        EventService,
        ChannelService,
        CurrencyService,
        NotificationService,
        PopupService,
        {
            useClass: FirebasePushService,
            provide: PushServiceBase
        }
    ]
})
export class NWalletProvidersModule {}
