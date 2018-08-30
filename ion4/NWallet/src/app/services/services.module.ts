import { TokenService } from './token/token.service';
import { NgModule } from '@angular/core';
import { LoggerService } from './common/logger/logger.service';
import { NWService } from './app/nw.service';
import { NWConfigService } from './app/nw-config.service';
import { AccountService } from './account/account.service';
import { PreferenceService } from './common/preference/preference.service';
import { NClientService } from './nsus/nwclient.service';
import { LockService } from './common/lock/lock.service';
import { PlatformService } from './common/platform/platform.service';
import { EventService } from './common/event/event.service';

@NgModule({
    providers: [
        LoggerService,
        NClientService,
        PreferenceService,
        AccountService,
        NWService,
        NWConfigService,
        PlatformService,
        LockService,
        TokenService,
        EventService
    ],
})
export class NWalletServiceModule {}
