import { Injectable } from '@angular/core';
import { NClientService } from './nclient.service';
import { LoggerService } from '../common/logger/logger.service';
import { NotificationService } from './notification.service';
import { NWAsset, NWTransaction } from '../../models/nwallet';
import { HttpErrorResponse } from '@angular/common/http';
import { GetWalletProtocol, SetConfigurationProtocol, GetWalletDetailProtocol, GetWalletTransactionsProtocol } from '../../models/nwallet/http-protocol';
import { Ticker, GetTickerProtocol } from '../../models/nwallet/protocol/ticker';
import { AuthorizationService } from '../auth/authorization.service';
import { HttpProtocolBase } from '../../models/nwallet/http-protocol-base';
import { GetSendAssetFeeProtocol, SendAssetProtocol } from '../../models/nwallet/protocol/send';
import { PutWalletAlignProtocol } from '../../models/nwallet/protocol/wallet-align';
import { Subject, Subscription } from 'rxjs';

@Injectable()
export class NsusChannelService {
    // todo fixme t.t
    private subscriptions = {
        onAsset: new Subject<NWAsset.Item[]>()
    };

    private subscriptionMap = new Map<string, Subject<any>>();

    constructor(private logger: LoggerService, private nClient: NClientService, private auth: AuthorizationService, private notification: NotificationService) {
        // this.AddOrUpdate();
    }

    // hmm...
    private getOrAdd(key: string): Subject<any> {
        return this.subscriptionMap.has(key) ? this.subscriptionMap.get(key) : this.subscriptionMap.set(key, new Subject<any>()).get(key);
    }

    private AddOrUpdate<T>(key: string, subject: Subject<T>): Subject<T> {
        return this.subscriptionMap.set(key, subject).get(key);
    }

    public register<TResponse>(request: { new ({}): HttpProtocolBase<TResponse> } | HttpProtocolBase<TResponse>, func: (value: TResponse) => void): Subscription {
        return this.getOrAdd(request.name).subscribe(func);
    }

    public aa<TResponse>(request: (req: NsusChannelService) => (...parms: any[]) => Promise<TResponse>, func: (d: TResponse) => void): Subscription {
        this.logger.debug('', { a: request, b: request.toString() });
        return this.getOrAdd(request.name).subscribe(func);
    }

    private broadcast<T, T1>(request: HttpProtocolBase<T>, value: T1): T1 {

        this.getOrAdd(request.name).next(value);
        return value;
    }

    //#region Protocol methods
    private async onRequestProtocol<T extends HttpProtocolBase<TResponse>, TResponse>(msg: string, func: (userId: string) => T): Promise<T> {
        const token = await this.auth.getToken();
        const userId = token.getUserId();
        const auth = token.getAuth();
        const request = func(userId);
        request.header = {
            authorization: auth
        };

        this.logger.debug(msg);
        return request;
    }

    private onResolveProtocol<T1>(log: string): (value: HttpProtocolBase<T1>) => HttpProtocolBase<T1> | PromiseLike<HttpProtocolBase<T1>> {
        return protocol => {
            this.logger.debug(`[channel] ${log}`, protocol.response);
            return protocol;
        };
    }

    private onResolveResponse<T1>(log: string): (value: HttpProtocolBase<T1>) => T1 | PromiseLike<T1> {
        return protocol => {
            this.logger.debug(`[channel] ${log}`, protocol.response);
            const ret = protocol.response;
            protocol.response = undefined;
            return ret;
        };
    }

    private onBroadCast<TData, TConvert>(log: string, func: (data: TData) => TConvert): (value: HttpProtocolBase<TData>) => TConvert | PromiseLike<TConvert> {
        return protocol => {
            this.logger.debug(`[channel] ${log}`);
            const convertData = func(protocol.response);
            return this.broadcast(protocol, convertData);
        };
    }

    private onError<T>(log: string, failover: T): (reason: any) => T | PromiseLike<T> {
        return error => {
            this.logger.debug(`[channel] ${log}`, error);
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

    public async fetchTicker(): Promise<Ticker[]> {
        return await this.nClient
            .get(await this.onRequestProtocol('[channel] ticker : request', userId => new GetTickerProtocol({ userId: userId })))
            .then(this.onResolveResponse('ticker : success'))
            .catch(this.onError('ticker : failed', []));
    }

    public async getAssets(): Promise<NWAsset.Item[]> {
        return await this.nClient
            .get(await this.onRequestProtocol('asset : request', userId => new GetWalletProtocol({ userId: userId })))
            .then(this.onResolveProtocol('asset : success'))
            .then(this.onBroadCast('asset : broadcast', protocol => protocol.map(p => new NWAsset.Item().initData(p))))
            .catch(this.onError('asset : failed', []));
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
                await this.onRequestProtocol('asset-transactions : request', userId =>
                    new GetWalletTransactionsProtocol({ userId: userId, userWalletId: walletId }).setQuery(query => {
                        query.offset = offset;
                        query.limit = limit;
                    })
                )
            )
            .then(this.onResolveProtocol('asset-transactions : success'))
            .then(this.onBroadCast('asset : broadcast', datas => datas.map(data => new NWTransaction.Item(data))))
            .catch(this.onError('asset-transactions : failed', []));
    }

    public async getSendAssetFee(walletId: number): Promise<number> {
        return await this.nClient
            .get(await this.onRequestProtocol('asset-fee : request', userId => new GetSendAssetFeeProtocol({ userId: userId, userWalletId: walletId })))
            .then(this.onResolveResponse('asset-fee : success'))
            .catch(this.onError('asset-transaction : failed', -1));
    }

    public async sendAsset(walletId: number, address: string, amount: number): Promise<boolean> {
        return await this.nClient
            .post(
                await this.onRequestProtocol('send-asset : request', userId =>
                    new SendAssetProtocol({ userId: userId, userWalletId: walletId }).setPayload(payload => {
                        payload.amount = amount;
                        payload.recipient_address = address;
                    })
                )
            )
            .then(this.onResolveResponse('send-asset : success'))
            .then(() => true)
            .catch(this.onError('send-asset : failed', false));
    }

    public async changeWalletOrder(align: number[]): Promise<boolean> {
        return await this.nClient
            .put(
                await this.onRequestProtocol('change-wallet-order : request', userId =>
                    new PutWalletAlignProtocol({ userId: userId }).setPayload(payload => {
                        payload.user_wallet_ids = align;
                    })
                )
            )
            .then(this.onResolveResponse('change-wallet-order : success'))
            .then(() => true)
            .catch(this.onError('change-wallet-order : failed', false));
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
            .put(await this.onRequestProtocol('notification : request', userId => new SetConfigurationProtocol({ userId: userId })))
            .then(this.onResolveResponse('notification : success'))
            .then(() => true)
            .catch(this.onError('notification : failed', false));
    }

    public close(): void {
        this.notification.flush();
    }
}
