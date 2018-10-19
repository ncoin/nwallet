import { Injectable } from '@angular/core';
import { NClientProvider } from './nclient';
import { LoggerService } from '../common/logger/logger.service';
import { AccountService } from '../account/account.service';
import { NotificationService } from './notification';
import { EventService } from '../common/event/event';
import { TokenService } from '../token/token.service';
import { NWAsset } from '../../models/nwallet';
import { HttpErrorResponse } from '@angular/common/http';
import { GetWalletRequest } from '../../models/nwallet/http-protocol';

@Injectable()
export class NsusChannelService {
    constructor(
        private event: EventService,
        private notification: NotificationService,
        private nClient: NClientProvider,
        private account: AccountService,
        private token: TokenService,
        private logger: LoggerService
    ) {}

    private onSuccess<TResponse>(log: string) {
        return (response: TResponse) => {
            this.logger.debug(`[channel] ${log}`, response);
            return response;
        };
    }

    private onError<T>(log: string, result: T | undefined) {
        return (error: HttpErrorResponse | Error) => {
            this.logger.error(`[nsus-channel] ${log}`, error);
            return result;
        };
    }

    public async requestPhoneVerification(phoneNumber: string): Promise<boolean> {
        this.logger.debug('[nsus-channel] phone number : ', phoneNumber);
        return true;
    }

    public async requestResetPincode(currentPin: string, newPin: string): Promise<boolean> {
        return true;
    }

    public async fetchJobs(): Promise<void> {
        this.logger.debug('[channel] request token');
        const token = await this.token.getToken();
        const detail = await this.account.detail();
        const assets = await this.getAssets(token.getUserId());
        detail.inventory.setItems(assets);

        this.notification.openStream();
    }

    public async getAssets(userId: string): Promise<NWAsset.Item[]> {
        this.logger.debug('[channel] get asset request');
        return await this.nClient
            .get(new GetWalletRequest(userId))
            .then(datas => {
                this.logger.debug('[channel] get asset request success');
                return datas.map(data => new NWAsset.Item().initData(data));
            })
            .catch(this.onError('[channel] get asset request failed', []));
    }

    public close(): void {
        this.notification.flush();
    }
}
