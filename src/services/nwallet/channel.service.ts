import { Injectable } from '@angular/core';
import { NetworkService } from './network.service';
import { LoggerService } from '../common/logger/logger.service';
import { NotificationService } from './notification.service';
import { NWAsset, NWTransaction, NWProtocol, NWData } from '../../models/nwallet';
import { AuthorizationService } from './authorization.service';
import { Subject, Subscription } from 'rxjs';
import { NWalletProtocolBase } from '../../models/api/nwallet/_impl';
import { NWConstants } from '../../models/constants';
import { Debug } from '../../utils/helper/debug';

@Injectable()
export class ChannelService {
    private subscriptionMap = new Map<string, Subject<any>>();
    constructor(private logger: LoggerService, private nClient: NetworkService, private auth: AuthorizationService, private notification: NotificationService) {}

    //#region prococol subscribe methopds
    private getOrAdd(key: string): Subject<any> {
        return this.subscriptionMap.has(key) ? this.subscriptionMap.get(key) : this.subscriptionMap.set(key, new Subject<any>()).get(key);
    }
    public register<T extends NWalletProtocolBase>(request: { new ({}): T } | T, func: (value: T) => void): Subscription {
        return this.getOrAdd(request.name).subscribe(func);
    }

    //#endregion

    //#region Service methods
    private async resolve<T extends NWalletProtocolBase>(func: (userId: number) => T): Promise<T> {
        const token = await this.auth.getToken();
        let userId,
            auth = '';
        if (token) {
            userId = token.getUserId();
            auth = token.getAuth();
        }

        const request = func(userId);
        request.header = {
            authorization: auth
        };

        this.logger.debug(`[channel] protcol requested : ${request.name}`);
        return request;
    }

    private onBroadcast<T extends NWalletProtocolBase>(): (value: T) => T | PromiseLike<T> {
        return protocol => {
            this.logger.debug(`[channel] protocol broadcast :`, protocol);
            this.getOrAdd(protocol.name).next(protocol);
            return protocol;
        };
    }

    private onSuccess<T extends NWalletProtocolBase>(): (p: T) => T | PromiseLike<T> {
        return (protocol: T) => {
            this.logger.debug('[channel] protocol succeed :', protocol.name, protocol.response);

            return protocol;
        };
    }

    private onError<T, TProtocol extends NWalletProtocolBase>(failover?: T): (protocol: TProtocol) => T | PromiseLike<T> {
        return protocol => {
            this.logger.debug(`[channel] protocol error :`, protocol);
            const errorMessage = protocol.getErrorMessage();
            if (errorMessage) {
                this.logger.warn(`[channel] protocol rejected : ${protocol.name} ${errorMessage}`);
            } else {
                this.logger.error(`[channel] protocol failed (unhandled): ${protocol.name}`, protocol);
            }

            return failover;
        };
    }

    //#endregion

    public async fetchTicker(): Promise<NWData.Ticker[]> {
        return await this.nClient
            .request(this.resolve(() => new NWProtocol.GetTickers()))
            .then(this.onSuccess())
            .then(this.onBroadcast())
            .then(p => p.response)
            .catch(this.onError([]));
    }

    public async fetchCurrencies(): Promise<NWData.Currency[]> {
        return await this.nClient
            .request(this.resolve(userId => new NWProtocol.GetCurrency()))
            .then(this.onSuccess())
            .then(this.onBroadcast())
            .then(p => p.response)
            .catch(this.onError([]));
    }

    public async getAssets(): Promise<NWAsset.Item[]> {
        return await this.nClient
            .request(this.resolve(userId => new NWProtocol.GetWallets({ userId: userId })))
            .then(this.onSuccess())
            .then(this.onBroadcast())
            .then(p => p.data)
            .catch(this.onError([]));
    }

    public async getWalletDetails(walletId: number): Promise<NWAsset.Data> {
        return await this.nClient
            .request(this.resolve(userId => new NWProtocol.GetWalletDetail({ userId: userId, walletId: walletId })))
            .then(this.onSuccess())
            .then(this.onBroadcast())
            .then(p => p.response)
            .catch(this.onError());
    }

    public async getWalletTransactions(walletId: number, offset: number, limit: number): Promise<NWTransaction.Item[]> {
        return await this.nClient
            .request(
                this.resolve(userId =>
                    new NWProtocol.GetWalletTransactions({ userId: userId, walletId: walletId }).setQuery(query => {
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
            .request(this.resolve(userId => new NWProtocol.GetSendAssetFee({ userId: userId, walletId: walletId })))
            .then(this.onSuccess())
            .then(p => p.response)
            .catch(this.onError(-1));
    }

    public async sendAsset(walletId: number, address: string, amount: number): Promise<boolean> {
        return await this.nClient
            .request(
                this.resolve(u =>
                    new NWProtocol.SendAsset(walletId).setPayload(payload => {
                        payload.amount = amount;
                        payload.recipientAddress = address;
                        payload.walletId = walletId;
                    })
                )
            )
            .then(this.onSuccess())
            .then(protocol => {
                Debug.assert(!protocol.isXdr());
                return true;
            })
            .catch(this.onError(false));
    }

    public async sendNCNAsset(walletId: number, address: string, amount: number): Promise<boolean> {
        return await this.nClient
            .request(
                this.resolve(u =>
                    new NWProtocol.SendAsset(walletId).setPayload(payload => {
                        payload.amount = amount;
                        payload.recipientAddress = address;
                        payload.walletId = walletId;
                    })
                )
            )
            .then(this.onSuccess())
            .then(async protocol => {
                Debug.assert(protocol.isXdr());
                // todo extract
                const signed = this.auth.signXdr(protocol.response.xdr);
                return await this.nClient
                    .request(
                        this.resolve(u =>
                            new NWProtocol.SendAssetXdr(walletId).setPayload({
                                transactionId: protocol.response.id,
                                walletId: walletId,
                                xdr: signed
                            })
                        )
                    )
                    .then(this.onSuccess())
                    .then(() => true)
                    .catch(this.onError(false));
            })
            .catch(this.onError(false));
    }

    public async changeWalletOrder(align: number[]) {
        return await this.nClient
            .request(
                this.resolve(userId =>
                    new NWProtocol.SetWalletAlign({ userId: userId }).setPayload(payload => {
                        payload.alignNumbers = align;
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
                this.resolve(userId =>
                    new NWProtocol.WalletOptionChange({ userId: userId, walletId: walletId }).setPayload(payload => {
                        payload.isShow = isVisible;
                    })
                )
            )
            .then(this.onSuccess())
            .then(this.onBroadcast())
            .catch(this.onError());
    }

    public async getAvailableWallets(): Promise<NWAsset.Available[]> {
        return await this.nClient
            .request(this.resolve(userId => new NWProtocol.GetAvailableWallet({ userId: userId })))
            .then(this.onSuccess())
            .then(this.onBroadcast())
            .then(p => p.data)
            .catch(this.onError([]));
    }

    public async createWallet(available: NWAsset.Available): Promise<boolean> {
        return await this.nClient
            .request(this.resolve(userId => new NWProtocol.CreateWallet().setPayload({ userId: userId, currencyId: available.Id, bitgoWalletId: available.WalletId })))
            .then(this.onSuccess())
            .then(this.onBroadcast())
            .then(() => true)
            .catch(this.onError(false));
    }

    public async createNCNWallet(): Promise<boolean> {
        const address = this.auth.getNCNAddress();
        return await this.nClient
            .request(this.resolve(userId => new NWProtocol.CreateNCNWallet().setPayload({ userId: userId, currencyId: NWConstants.NCN.currencyId, ncoinPublicKey: address })))
            .then(this.onSuccess())
            .then(this.onBroadcast())
            .then(async protocol => {
                const walletId = protocol.response.id;
                const xdr = await this.nClient
                    .request(this.resolve(() => new NWProtocol.CreateWalletTrust().setPayload({ walletId: walletId })))
                    .then(this.onSuccess())
                    .then(trustProtocol => trustProtocol.response.xdr)
                    .catch(this.onError(''));

                if (xdr !== '') {
                    const signedXdr = this.auth.signXdr(xdr);

                    await this.nClient
                        .request(this.resolve(() => new NWProtocol.ExecuteWalletTrust().setPayload({ walletId: walletId, xdr: signedXdr })))
                        .then(this.onSuccess())
                        .catch(this.onError(''));
                }

                return true;
            })
            .catch(this.onError(false));
    }

    public async setUserNotifications(isOn: boolean): Promise<boolean> {
        return await this.nClient
            .request(
                this.resolve(userId =>
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
