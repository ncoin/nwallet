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
import { Result } from '../../models/api/response';
import { ResultCode } from '../../interfaces/error';

@Injectable()
export class ChannelService {
    private subscriptionMap = new Map<string, Subject<any>>();
    constructor(private logger: LoggerService, private network: NetworkService, private auth: AuthorizationService, private notification: NotificationService) {}

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
        const userId = token.getUserId();
        const auth = token.getAuth();

        const request = func.length > 0 ? func(userId) : func(undefined);
        request.header = {
            authorization: auth
        };

        this.logger.debug(`[channel] protocol requested : ${request.name}`);
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
        return await this.network
            .request(this.resolve(() => new NWProtocol.GetTickers()))
            .then(this.onSuccess())
            .then(this.onBroadcast())
            .then(p => p.response)
            .catch(this.onError([]));
    }

    public async fetchCurrencies(): Promise<NWData.Currency[]> {
        return await this.network
            .request(this.resolve(userId => new NWProtocol.GetCurrency()))
            .then(this.onSuccess())
            .then(this.onBroadcast())
            .then(p => p.response)
            .catch(this.onError([]));
    }

    public async getAssets(): Promise<NWAsset.Item[]> {
        return await this.network
            .request(this.resolve(userId => new NWProtocol.GetWallets({ userId: userId })))
            .then(this.onSuccess())
            .then(this.onBroadcast())
            .then(p => p.data)
            .catch(this.onError([]));
    }

    public async getWalletDetails(walletId: number): Promise<NWAsset.Data> {
        return await this.network
            .request(this.resolve(userId => new NWProtocol.GetWalletDetail({ userId: userId, walletId: walletId })))
            .then(this.onSuccess())
            .then(this.onBroadcast())
            .then(p => p.response)
            .catch(this.onError());
    }

    public async getWalletTransactions(walletId: number, offset: number, limit: number): Promise<NWTransaction.Item[]> {
        return await this.network
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

    public async sendAsset(walletId: number, address: string, amount: number): Promise<boolean> {
        return await this.network
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
                let result = false;
                result = protocol.isSuccess();
                if (protocol.isXdr()) {
                    const signedXdr = this.auth.signXdr(protocol.response.xdr);
                    result = await this.network
                        .request(
                            this.resolve(u =>
                                new NWProtocol.SendAssetXdr(walletId).setPayload({
                                    transactionId: protocol.response.id,
                                    walletId: walletId,
                                    xdr: signedXdr
                                })
                            )
                        )
                        .then(this.onSuccess())
                        .then(() => true)
                        .catch(this.onError(false));
                }
                return result;
            })
            .catch(this.onError(false));
    }

    public async changeWalletOrder(align: number[]) {
        return await this.network
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
        this.network
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
        return await this.network
            .request(this.resolve(userId => new NWProtocol.GetAvailableWallet({ userId: userId })))
            .then(this.onSuccess())
            .then(this.onBroadcast())
            .then(p => p.data)
            .catch(this.onError([]));
    }

    public async createWallet(available: NWAsset.Available): Promise<boolean> {
        return await this.network
            .request(this.resolve(userId => new NWProtocol.CreateWallet().setPayload({ userId: userId, currencyId: available.Id, bitgoWalletId: available.WalletId })))
            .then(this.onSuccess())
            .then(this.onBroadcast())
            .then(() => true)
            .catch(this.onError(false));
    }

    public async createNCNWallet(): Promise<boolean> {
        const address = this.auth.getNCNAddress();
        return await this.network
            .request(this.resolve(userId => new NWProtocol.CreateNCNWallet().setPayload({ userId: userId, currencyId: NWConstants.NCN.currencyId, ncoinPublicKey: address })))
            .then(this.onSuccess())
            .then(this.onBroadcast())
            .then(async protocol => {
                const walletId = protocol.response.id;
                const xdr = await this.network
                    .request(this.resolve(() => new NWProtocol.CreateWalletTrust().setPayload({ walletId: walletId })))
                    .then(this.onSuccess())
                    .then(trustProtocol => trustProtocol.response.xdr)
                    .catch(this.onError(''));

                if (xdr !== '') {
                    const signedXdr = this.auth.signXdr(xdr);

                    await this.network
                        .request(this.resolve(() => new NWProtocol.ExecuteWalletTrust().setPayload({ walletId: walletId, xdr: signedXdr })))
                        .then(this.onSuccess())
                        .catch(this.onError(''));
                }

                return true;
            })
            .catch(this.onError(false));
    }

    public async getCollateralTransactions(collateralId: number, offset: number = 0, limit: number = 10, order?: 'ASC' | 'DESC'): Promise<NWTransaction.Collateral[]> {
        return await this.network
            .request(
                this.resolve(() =>
                    new NWProtocol.CollateralTransactions({ collateralId: collateralId }).setQuery({
                        collateralId: collateralId,
                        limit: limit,
                        offset: offset,
                        order: order
                    })
                )
            )
            .then(this.onSuccess())
            .then(this.onBroadcast())
            .then(p => p.data)
            .catch(this.onError([]));
    }

    public async requestCollateralLoan(collateralId: number, amount: number): Promise<Result> {
        return await this.network
            .request(
                this.resolve(() =>
                    new NWProtocol.CollateralLoan({ collateralId: collateralId }).setPayload({
                        collateralId: collateralId,
                        amount: amount
                    })
                )
            )
            .then(this.onSuccess())
            .then(Result.resolve())
            .catch(p => {
                // todo fixme
                this.onError()(p);
                return Result.resolve()(p);
            });
    }

    public async requestCollateralRepay(collateralId: number, amount: number): Promise<Result> {
        return await this.network
            .request(
                this.resolve(() =>
                    new NWProtocol.CreateCollateralRepay({ collateralId: collateralId }).setPayload({
                        collateralId: collateralId,
                        amount: amount
                    })
                )
            )
            .then(this.onSuccess())
            .then(async protocol => {
                Debug.assert(protocol.isXdr(), 'xdr not found, response :', protocol.response);
                const signedXdr = this.auth.signXdr(protocol.response.xdr);
                return await this.network
                    .request(this.resolve(() => new NWProtocol.ExecuteCollateralRepay({ collateralId: collateralId }).setPayload({ collateralId: collateralId, xdr: signedXdr })))
                    .then(this.onSuccess());
            })
            .then(Result.resolve())
            .catch(p => {
                // todo fixme
                this.onError()(p);
                return Result.resolve()(p);
            });
    }

    public async buyNcn(walletId: number, amount: number): Promise<Result> {
        return await this.network
            .request(
                this.resolve(userId =>
                    new NWProtocol.BuyNcn({ walletId: walletId }).setPayload({
                        amount: amount,
                        walletId: walletId,
                        userId: userId
                    })
                )
            )
            .then(this.onSuccess())
            .then(Result.resolve())
            .catch(p => {
                this.onError()(p);
                return Result.resolve()(p);
            });
    }

    public async setUserNotifications(isOn: boolean): Promise<boolean> {
        return await this.network
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
