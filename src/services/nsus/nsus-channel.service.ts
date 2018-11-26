import { Injectable } from '@angular/core';
import { NClientService } from './nclient.service';
import { LoggerService } from '../common/logger/logger.service';
import { NotificationService } from './notification.service';
import { NWAsset, NWTransaction, NWProtocol, NWData } from '../../models/nwallet';
import { AuthorizationService } from './authorization.service';
import { Subject, Subscription } from 'rxjs';
import { NClientProtocolBase } from '../../models/api/nwallet/_impl';

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
    public register<T extends NClientProtocolBase>(request: { new ({}): T } | T, func: (value: T) => void): Subscription {
        return this.getOrAdd(request.name).subscribe(func);
    }

    //#region Protocol methods
    private async resolve<T extends NClientProtocolBase>(func: (userId: string) => T): Promise<T> {
        const token = await this.auth.getToken();
        let userId,
            auth = '';
        if (token) {
            userId = token.getUserId();
            auth = token.getAuth();
        } else {
            this.logger.debug('[channel] request token failed');
        }

        const request = func(userId);
        request.header = {
            authorization: auth
        };

        this.logger.debug(`[channel] protcol requested : ${request.name}`);
        return request;
    }

    // hmm.... 1
    private onBroadcast<T extends NClientProtocolBase>(): (value: T) => T | PromiseLike<T> {
        return protocol => {
            this.logger.debug(`[channel] protocol broadcast :`, protocol);
            this.getOrAdd(protocol.name).next(protocol);
            return protocol;
        };
    }

    private onSuccess<T extends NClientProtocolBase>(): (p: T) => T | PromiseLike<T> {
        return (protocol: T) => {
            this.logger.debug(`[channel] protocol succeed : ${protocol.name}`, protocol.response);

            return protocol;
        };
    }

    private onError<T>(failover?: T): (protocol: any) => T | PromiseLike<T> {
        return protocol => {
            this.logger.error(`[channel] protocol error : ${protocol.name}`, protocol);
            return failover;
        };
    }

    //#endregion

    public async fetchTicker(): Promise<NWData.Ticker[]> {
        return await this.nClient
            .request(await this.resolve(userId => new NWProtocol.GetTickers({ userId: userId })))
            .then(this.onSuccess())
            .then(p => p.response)
            .catch(this.onError([]));
    }

    public async getAssets(): Promise<NWAsset.Item[]> {
        return await this.nClient
            .request(await this.resolve(userId => new NWProtocol.GetWallets({ userId: userId })))
            .then(this.onSuccess())
            .then(p => p.data)
            .catch(this.onError([]));
    }

    public getWalletDetails = async (walletId: number): Promise<NWAsset.Data> => {
        return await this.nClient
            .request(await this.resolve(userId => new NWProtocol.GetWalletDetail({ userId: userId, userWalletId: walletId })))
            .then(this.onSuccess())
            .then(this.onBroadcast())
            .then(p => p.response)
            .catch(this.onError());
    }

    public async getWalletTransactions(walletId: number, offset: number, limit: number): Promise<NWTransaction.Item[]> {
        return await this.nClient
            .request(
                await this.resolve(userId =>
                    new NWProtocol.GetWalletTransactions({ userId: userId, userWalletId: walletId }).setQuery(query => {
                        query.offset = offset;
                        query.limit = limit;
                    })
                )
            )
            .then(this.onSuccess())
            .then(this.onBroadcast())
            .then(p => p.data)
            .catch(this.onError([]));
    }

    public async getSendAssetFee(walletId: number): Promise<number> {
        return await this.nClient
            .request(await this.resolve(userId => new NWProtocol.GetSendAssetFee({ userId: userId, userWalletId: walletId })))
            .then(this.onSuccess())
            .then(p => p.response)
            .catch(this.onError(-1));
    }

    public async sendAsset(walletId: number, address: string, amount: number): Promise<boolean> {
        return await this.nClient
            .request(
                await this.resolve(userId =>
                    new NWProtocol.SendAsset({ userId: userId, userWalletId: walletId }).setPayload(payload => {
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
            .request(
                await this.resolve(userId =>
                    new NWProtocol.SetWalletAlign({ userId: userId }).setPayload(payload => {
                        payload.user_wallet_ids = align;
                    })
                )
            )
            .then(this.onSuccess())
            .then(this.onBroadcast())
            .then(p => p.data)
            .catch(this.onError([]));
    }

    public async changeWalletVisibility(walletId: number, isVisible: boolean): Promise<void> {
        this.nClient
            .request(
                await this.resolve(userId =>
                    new NWProtocol.SetWalletVisibility({ userId: userId, userWalletId: walletId }).setPayload(payload => {
                        payload.is_show = isVisible;
                    })
                )
            )
            .then(this.onSuccess())
            .then(this.onBroadcast())
            .catch(this.onError());
    }

    public async getAvailableWallets(): Promise<NWAsset.Available[]> {
        return await this.nClient
            .request(await this.resolve(userId => new NWProtocol.GetAvailableWallet({ userId: userId })))
            .then(this.onSuccess())
            .then(this.onBroadcast())
            .then(p => p.data)
            .catch(this.onError([]));
    }

    public async createWallet(currencyId: number): Promise<boolean> {
        return await this.nClient
            .request(
                await this.resolve(
                    userId =>
                        new NWProtocol.CreateWallet(
                            { userId: userId },
                            {
                                payload: { currency_manage_id: currencyId }
                            }
                        )
                )
            )
            .then(this.onSuccess())
            .then(this.onBroadcast())
            .then(() => true)
            .catch(this.onError(false));
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
            .request(
                await this.resolve(userId =>
                    new NWProtocol.SetConfigurations({ userId: userId }).setPayload({
                        device_id: undefined,
                        is_push_notification: isOn
                    })
                )
            )
            .then(this.onSuccess())
            .then(() => true)
            .catch(this.onError(false));
    }

    public close(): void {
        this.notification.flush();
    }
}
