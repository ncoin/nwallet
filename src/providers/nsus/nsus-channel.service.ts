import { Injectable } from '@angular/core';
import { NClientService } from './nclient.service';
import { LoggerService } from '../common/logger/logger.service';
import { NotificationService } from './notification.service';
import { NWAsset, NWTransaction, NWProtocol } from '../../models/nwallet';
import { AuthorizationService } from '../auth/authorization.service';
import { HttpProtocolBase, HttpProtocol } from '../../models/nwallet/protocol/http/http-protocol';
import { Subject, Subscription } from 'rxjs';
interface ProtocolResolver<T, TResponse, TConvert> {
    convert: (response: TResponse) => TConvert;
    broadCast: () => this;
    response: () => TResponse;
    value: () => TResponse | TConvert;
}

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
    private async onRequestProtocol<T extends HttpProtocol>(func: (userId: string) => T): Promise<T> {
        const token = await this.auth.getToken();
        const userId = token.getUserId();
        const auth = token.getAuth();
        const request = func(userId);
        request.header = {
            authorization: auth
        };

        this.logger.debug(`[channel] protcol requested : ${request.name}`);
        return request;
    }

    private onSuccess<T extends HttpProtocol>(): (value: T) => T | PromiseLike<T> {
        return protocol => {
            this.logger.debug(`[channel] protocol succeed : ${protocol.name}`);
            if (protocol.response) {
                this.logger.debug(`[channel] protocol response : ${protocol.name}`, protocol.response);
            }
            return protocol;
        };
    }

    // hmm.... 1
    private onBroadcast<TResponse = object, TConvert = object>(
        func: (value: HttpProtocolBase<TResponse, TConvert>) => TConvert
    ): (value: HttpProtocolBase<TResponse, TConvert>) => TConvert {
        return protocol => {
            const convert = func(protocol);
            this.logger.debug(`[channel] protocol broadcast : ${protocol.name}`, convert);
            this.getOrAdd(protocol.name).next(convert);
            return convert;
        };
    }

    private onRetrieveResponse<T1, TConvert>(): (value: HttpProtocolBase<T1, TConvert>) => T1 | PromiseLike<T1> {
        return protocol => {
            return protocol.response;
        };
    }

    // hmm.... 2
    private onBroadcastResponse<TResponse, TConvert>(func: (value: TResponse) => TConvert): (proto: HttpProtocolBase<TResponse, TConvert>) => TConvert {
        return protocol => {
            const convert = func(protocol.response);
            this.logger.debug(`[channel] protocol broadcast : ${protocol.name}`, convert);
            this.getOrAdd(protocol.name).next(convert);
            return convert;
        };
    }

    private onError<T>(failover: T): (protocol: any) => T | PromiseLike<T> {
        return protocol => {
            this.logger.error(`[channel] protocol error : ${protocol.name}`, protocol);
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
            .get(await this.onRequestProtocol(userId => new NWProtocol.GetTickers({ userId: userId })))
            .then(this.onSuccess())
            .then(this.onRetrieveResponse())
            .catch(this.onError([]));
    }

    public async getAssets(): Promise<NWAsset.Item[]> {
        return await this.nClient
            .get(await this.onRequestProtocol(userId => new NWProtocol.GetWallets({ userId: userId })))
            .then(this.onSuccess())
            .then(this.onBroadcastResponse(response => response.map(data => new NWAsset.Item().initData(data))))
            .catch(this.onError([]));
    }

    // public getWalletDetails = async (walletId: number): Promise<NWTransaction.Item[]> => {
    //     return await this.nClient
    //         .get(await this.onRequest('asset-detail : request', userId => new GetWalletDetailRequest({ userId: userId, userWalletId: walletId })))
    //         .then(this.onSuccess('asset-detail : success'))
    //         .catch(this.onError('asset-detail : failed'));
    // };

    public async getWalletTransactions(walletId: number, offset: number, limit: number) {
        return await this.nClient
            .get(
                await this.onRequestProtocol(userId =>
                    new NWProtocol.GetWalletTransactions({ userId: userId, userWalletId: walletId }).setQuery(query => {
                        query.offset = offset;
                        query.limit = limit;
                    })
                )
            )
            .then(this.onSuccess())
            .then(this.onBroadcastResponse(r => r.map(data => new NWTransaction.Item(data))))
            .catch(this.onError([]));
    }

    public async getSendAssetFee(walletId: number): Promise<number> {
        return await this.nClient
            .get(await this.onRequestProtocol(userId => new NWProtocol.GetSendAssetFee({ userId: userId, userWalletId: walletId })))
            .then(this.onRetrieveResponse())
            .catch(this.onError(-1));
    }

    public async sendAsset(walletId: number, address: string, amount: number): Promise<boolean> {
        return await this.nClient
            .post(
                await this.onRequestProtocol(userId =>
                    new NWProtocol.PostSendAsset({ userId: userId, userWalletId: walletId }).setPayload(payload => {
                        payload.amount = amount;
                        payload.recipient_address = address;
                    })
                )
            )
            .then(this.onSuccess())
            .then(() => true)
            .catch(this.onError(false));
    }

    public async changeWalletOrder(align: number[]) {
        return await this.nClient
            .put(
                await this.onRequestProtocol(userId =>
                    new NWProtocol.PutWalletAlign({ userId: userId }).setPayload(payload => {
                        payload.user_wallet_ids = align;
                    })
                )
            )
            .then(this.onSuccess())
            .then(this.onBroadcastResponse(r => align))
            .catch(this.onError([]));
    }

    public async changeWalletVisibility(walletId: number, isVisible: boolean): Promise<boolean> {
        return await this.nClient
            .put(
                await this.onRequestProtocol(userId =>
                    new NWProtocol.PutWalletVisibility({ userId: userId, userWalletId: walletId }).setPayload(payload => {
                        payload.is_show = isVisible;
                    })
                )
            )
            .then(this.onSuccess())
            .then(this.onBroadcast(protocol => protocol.convert()))
            .then(() => true)
            .catch(this.onError(false));
    }

    public async getAvailableWallets(): Promise<NWAsset.Available[]> {
        return await this.nClient
            .get(await this.onRequestProtocol(userId => new NWProtocol.AvailableWallet({ userId: userId })))
            .then(this.onSuccess())
            .then(this.onBroadcast(protocol => protocol.convert()))
            .catch(this.onError([]));
    }

    public async createWallet() {
        return await this.nClient.post(await this.onRequestProtocol(userId => new NWProtocol.CreateWallet({ userId: userId }, payload => {})));
    }

    /**
     *
     *
     * @param {boolean} isOn - notification on/off
     * @returns {Promise<boolean>} request success
     * @memberof NsusChannelService
     */
    public async setUserPush(isOn: boolean): Promise<boolean> {
        return await this.nClient
            .put(await this.onRequestProtocol(userId => new NWProtocol.PutConfiguration({ userId: userId })))
            .then(this.onSuccess())
            .then(() => true)
            .catch(this.onError(false));
    }

    public close(): void {
        this.notification.flush();
    }
}
