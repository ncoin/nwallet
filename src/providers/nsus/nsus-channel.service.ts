import { Injectable } from '@angular/core';
import { NClientService } from './nclient.service';
import { LoggerService } from '../common/logger/logger.service';
import { AccountService } from '../account/account.service';
import { NotificationService } from './notification.service';
import { EventService } from '../common/event/event';
import { TokenService } from '../token/token.service';
import { NWAsset, NWTransaction } from '../../models/nwallet';
import { HttpErrorResponse } from '@angular/common/http';
import { GetWalletRequest, SetConfigurationRequest, GetWalletTransactionRequest } from '../../models/nwallet/http-protocol';

@Injectable()
export class NsusChannelService {
    constructor(
        private event: EventService,
        private notification: NotificationService,
        private nClient: NClientService,
        private account: AccountService,
        private token: TokenService,
        private logger: LoggerService
    ) {}

    private onSuccess<TResponse>(log: string, func?: (data: TResponse) => any) {
        return (response: TResponse) => {
            this.logger.debug(`[channel] ${log}`, response);
            if (func) {
                return func(response);
            }
            return response;
        };
    }

    private onError<T>(log: string, result?: T | undefined) {
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
        const detail = await this.account.detail();
        const assets = await this.getAssets();
        detail.inventory.setItems(assets);

        this.notification.openStream();
    }

    public async getAssets(): Promise<NWAsset.Item[]> {
        this.logger.debug('[channel][get-asset] request token');
        const token = await this.token.getToken();

        this.logger.debug('[channel] get asset request');
        return await this.nClient
            .get(new GetWalletRequest({ userId: token.getUserId() }))
            .then(this.onSuccess('[channel] get asset request success', datas => datas.map(data => new NWAsset.Item().initData(data))))
            .catch(this.onError('[channel] get asset request failed', []));
    }

    public async getAssetTransactions(walletId: number, offset: number, limit: number): Promise<NWTransaction.Item[]> {
        this.logger.debug('[channel][get-asset-detail] request token');
        const token = await this.token.getToken();

        this.logger.debug('[channel] get-asset-detail request');
        return await this.nClient
            .get(
                new GetWalletTransactionRequest({
                    userId: token.getUserId(),
                    userWalletId: walletId
                }).setQuery(param => {
                    param.offset = offset;
                    param.limit = limit;
                })
            )
            .then(this.onSuccess('[channel] get-asset-request success'))
            .catch(this.onError('[channel] get-asset-request failed'));
    }

    public async changeWalletOrder() {}

    public async getUserManageWallets(): Promise<NWAsset.Item[]> {
        return [];
    }

    public async getSupportedWallets(): Promise<void> {}

    /**
     *
     *
     * @param {boolean} isOn - notification on/off
     * @returns {Promise<boolean>} request success
     * @memberof NsusChannelService
     */
    public async setUserPush(isOn: boolean): Promise<boolean> {
        this.logger.debug('[channel][set-notification] request token');
        const token = await this.token.getToken();

        this.logger.debug('[channel] get asset request');
        return await this.nClient
            .put(new SetConfigurationRequest({ userId: token.getUserId() }))
            .then(this.onSuccess('[channel] set notification success'))
            .then(() => true)
            .catch(this.onError('[channel] get asset request failed', false));
    }

    public close(): void {
        this.notification.flush();
    }
}
