import { Injectable } from '@angular/core';
import { NClientService } from './nclient.service';
import { LoggerService } from '../common/logger/logger.service';
import { NotificationService } from './notification.service';
import { NWAsset, NWTransaction } from '../../models/nwallet';
import { HttpErrorResponse } from '@angular/common/http';
import { GetWalletRequest, SetConfigurationRequest, GetWalletTransactionRequest } from '../../models/nwallet/http-protocol';
import { Ticker, GetTickerRequest } from '../../models/nwallet/protocol/ticker';
import { AuthorizationService } from '../auth/authorization.service';
import { HttpRequestBase, GetRequestBase } from '../../models/nwallet/http-protocol-base';

@Injectable()
export class NsusChannelService {
    constructor(private logger: LoggerService, private nClient: NClientService, private auth: AuthorizationService, private notification: NotificationService) {}

    private async onRequest<T extends HttpRequestBase>(msg: string, func: (userId: string) => T): Promise<T> {
        const token = await this.auth.getToken();
        const userId = token.getUserId();
        const auth = token.getAuth();
        const request = func(userId);
        request.header = {
            authorization: auth
        };


        this.logger.debug(`[channel] ${msg}`);
        return request;
    }

    // todo change 'any' response type --sky
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
            this.logger.error(`[channel] ${log}`, error);
            return result;
        };
    }

    public async requestPhoneVerification(phoneNumber: string): Promise<boolean> {
        return true;
    }

    public async requestResetPincode(currentPin: string, newPin: string): Promise<boolean> {
        return true;
    }

    public async fetchTicker(): Promise<Ticker[]> {
        return await this.nClient
            .get(await this.onRequest('ticker : request', userId => new GetTickerRequest({ userId: userId })))
            .then(this.onSuccess('ticker : success'))
            .catch(this.onError('ticker : failed'));
    }

    public async getAssets(): Promise<NWAsset.Item[]> {
        return await this.nClient
            .get(await this.onRequest('asset : request', userId => new GetWalletRequest({ userId: userId })))
            .then(this.onSuccess('asset : success', datas => datas.map(data => new NWAsset.Item().initData(data))))
            .catch(this.onError('asset : failed', []));
    }

    public async getAssetTransactions(walletId: number, offset: number, limit: number): Promise<NWTransaction.Item[]> {
        return await this.nClient
            .get(
                await this.onRequest('asset-transactions : request', userId =>
                    new GetWalletTransactionRequest({
                        userId: userId,
                        userWalletId: walletId
                    }).setQuery(param => {
                        param.offset = offset;
                        param.limit = limit;
                    })
                )
            )
            .then(this.onSuccess('asset-transactions : success'))
            .catch(this.onError('asset-transactions : failed'));
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
        return await this.nClient
            .put(await this.onRequest('notification : request', userId => new SetConfigurationRequest({ userId: userId })))
            .then(this.onSuccess('notification : success'))
            .then(() => true)
            .catch(this.onError('notification :  failed', false));
    }

    public close(): void {
        this.notification.flush();
    }
}
