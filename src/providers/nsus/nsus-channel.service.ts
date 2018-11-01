import { Injectable } from '@angular/core';
import { NClientService } from './nclient.service';
import { LoggerService } from '../common/logger/logger.service';
import { NotificationService } from './notification.service';
import { NWAsset, NWTransaction, NWProtocol } from '../../models/nwallet';
import { AuthorizationService } from '../auth/authorization.service';
import { HttpProtocolBase } from '../../models/nwallet/protocol/http/http-protocol';
import { Subject, Subscription } from 'rxjs';

@Injectable()
export class NsusChannelService {
    private subscriptionMap = new Map<string, Subject<any>>();

    constructor(private logger: LoggerService, private nClient: NClientService, private auth: AuthorizationService, private notification: NotificationService) {
        // this.AddOrUpdate();
    }

    // hmm...
    private getOrAdd(key: string): Subject<any> {
        return this.subscriptionMap.has(key) ? this.subscriptionMap.get(key) : this.subscriptionMap.set(key, new Subject<any>()).get(key);
    }
    public register<TResponse, TConvert>(
        request: { new ({}): HttpProtocolBase<TResponse, TConvert> } | HttpProtocolBase<TResponse, TConvert>,
        func: (value: TConvert) => void
    ): Subscription {
        return this.getOrAdd(request.name).subscribe(func);
    }

    //#region Protocol methods
    private async onRequestProtocol<T extends HttpProtocolBase<TResponse, TConvert>, TResponse, TConvert>(func: (userId: string) => T): Promise<T> {
        const token = await this.auth.getToken();
        const userId = token.getUserId();
        const auth = token.getAuth();
        const request = func(userId);
        request.header = {
            authorization: auth
        };

        this.logger.debug(`[channel] request protcol : ${request.name}`);
        return request;
    }

    private onResolveProtocol<T1, TConvert>(): (value: HttpProtocolBase<T1, TConvert>) => HttpProtocolBase<T1, TConvert> | PromiseLike<HttpProtocolBase<T1, TConvert>> {
        return protocol => {
            this.logger.debug(`[channel] resolve protocol : ${protocol.name}`, protocol.response);
            return protocol;
        };
    }

    private onResolveResponse<T1, TConvert>(): (value: HttpProtocolBase<T1, TConvert>) => T1 | PromiseLike<T1> {
        return protocol => {
            this.logger.debug(`[channel] resolve protocol response : ${protocol.name}`, protocol.response);
            const ret = protocol.response;
            protocol.response = undefined;
            return ret;
        };
    }

    private onBroadcast<TData, TConvert>(func: (data: TData) => TConvert): (protocol: HttpProtocolBase<TData, TConvert>) => TConvert | PromiseLike<TConvert> {
        return protocol => {
            const convertData = func(protocol.response);
            this.logger.debug(`[channel] broadcast protocol : ${protocol.name}`, convertData);

            this.getOrAdd(protocol.name).next(convertData);
            return convertData;
        };
    }

    private onError<T>(failover: T): (protocol: any) => T | PromiseLike<T> {
        return protocol => {
            this.logger.error(`[channel] error occured : ${protocol.name}`, protocol);
            return failover;
        };
    }

    //#endregion

    // todo merge request process --sky
    public async requestPhoneVerification(phoneNumber: string): Promise<boolean> {
        return true;
    }

    public async requestResetPincode(currentPin: string, newPin: string): Promise<boolean> {
        return true;
    }

    public async fetchTicker(): Promise<NWProtocol.Ticker[]> {
        return await this.nClient
            .get(await this.onRequestProtocol(userId => new NWProtocol.GetTickerProtocol({ userId: userId })))
            .then(this.onResolveResponse())
            .catch(this.onError([]));
    }

    public async getAssets(): Promise<NWAsset.Item[]> {
        return await this.nClient
            .get(await this.onRequestProtocol(userId => new NWProtocol.GetWalletProtocol({ userId: userId })))
            .then(this.onResolveProtocol())
            .then(this.onBroadcast(protocol => protocol.map(p => new NWAsset.Item().initData(p))))
            .catch(this.onError([]));
    }

    // public getWalletDetails = async (walletId: number): Promise<NWTransaction.Item[]> => {
    //     return await this.nClient
    //         .get(await this.onRequest('asset-detail : request', userId => new GetWalletDetailRequest({ userId: userId, userWalletId: walletId })))
    //         .then(this.onSuccess('asset-detail : success'))
    //         .catch(this.onError('asset-detail : failed'));
    // };

    public async getWalletTransactions(walletId: number, offset: number, limit: number): Promise<NWTransaction.Item[]> {
        return await this.nClient
            .get(
                await this.onRequestProtocol(userId =>
                    new NWProtocol.GetWalletTransactionsProtocol({ userId: userId, userWalletId: walletId }).setQuery(query => {
                        query.offset = offset;
                        query.limit = limit;
                    })
                )
            )
            .then(this.onResolveProtocol())
            .then(this.onBroadcast(datas => datas.map(data => new NWTransaction.Item(data))))
            .catch(this.onError([]));
    }

    public async getSendAssetFee(walletId: number): Promise<number> {
        return await this.nClient
            .get(await this.onRequestProtocol(userId => new NWProtocol.GetSendAssetFeeProtocol({ userId: userId, userWalletId: walletId })))
            .then(this.onResolveResponse())
            .catch(this.onError(-1));
    }

    public async sendAsset(walletId: number, address: string, amount: number): Promise<boolean> {
        return await this.nClient
            .post(
                await this.onRequestProtocol(userId =>
                    new NWProtocol.SendAssetProtocol({ userId: userId, userWalletId: walletId }).setPayload(payload => {
                        payload.amount = amount;
                        payload.recipient_address = address;
                    })
                )
            )
            .then(this.onResolveResponse())
            .then(() => true)
            .catch(this.onError(false));
    }

    public async changeWalletOrder(align: number[]): Promise<number[]> {
        return await this.nClient
            .put(
                await this.onRequestProtocol(userId =>
                    new NWProtocol.PutWalletAlignProtocol({ userId: userId }).setPayload(payload => {
                        payload.user_wallet_ids = align;
                    })
                )
            )
            .then(this.onResolveProtocol())
            .then(this.onBroadcast(() => align))
            .catch(this.onError([]));
    }

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
            .put(await this.onRequestProtocol(userId => new NWProtocol.SetConfigurationProtocol({ userId: userId })))
            .then(this.onResolveProtocol())
            .then(() => true)
            .catch(this.onError(false));
    }

    public close(): void {
        this.notification.flush();
    }
}
