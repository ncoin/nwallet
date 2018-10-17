import { Injectable } from '@angular/core';
import { NClientProvider } from './nclient';
import { LoggerService } from '../common/logger/logger.service';
import { AccountService } from '../account/account.service';
import { NotificationService } from './notification';
import { EventService } from '../common/event/event';

@Injectable()
export class NsusChannelService {
    constructor(
        private nClient: NClientProvider,
        private logger: LoggerService,
        private account: AccountService,
        private notification: NotificationService,
        private event: EventService
    ) {
        this.notification.openStream();
    }

    public async requestPhoneVerification(phoneNumber: string): Promise<boolean> {
        this.logger.debug('[nsus-channel] phone number : ', phoneNumber);
        return true;
    }

    public async requestResetPincode(currentPin: string, newPin: string): Promise<boolean> {
        return true;
    }

    public async fetchJobs(): Promise<void> {
        const assets = await this.nClient.getAssets();
        const detail = await this.account.detail();
        detail.inventory.setItems(assets);

        this.notification.openStream();
    }

    // todo refactoring --sky
    public async getAssets(): Promise<void> {}

    public close(): void {
        this.notification.flush();
    }
}
