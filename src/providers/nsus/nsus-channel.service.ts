import { Injectable } from '@angular/core';
import { NClientProvider } from './nclient';
import { LoggerService } from '../common/logger/logger.service';

@Injectable()
export class NsusChannelService {
    constructor(private nClient: NClientProvider, private logger: LoggerService) {}

    public async requestPhoneVerification(phoneNumber: string): Promise<boolean> {
        this.logger.debug('[nsus-channel] phone number : ', phoneNumber);
        return true;
    }

    public async requestResetPincode(currentPin: string, newPin: string): Promise<boolean> {
        return true;
    }


}
