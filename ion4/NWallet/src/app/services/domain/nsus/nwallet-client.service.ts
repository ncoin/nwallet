import { env } from './../../../../environments/environment';
import { Asset } from 'stellar-sdk';
import { Injectable } from '@angular/core';

import { EventTypes } from '../../interfaces/events';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { LoggerService } from '../../cores/logger/logger.service';
import { EventService } from '../../cores/event/event.service';
import { TokenService } from '../token/token.service';
import { ParameterExpr, createExpr } from 'forge';
import * as _ from 'lodash';
import { NWallet, getOrAddWalletItem } from '../../../interfaces/nwallet';
import { Subscription, Observable } from 'rxjs/rx';

@Injectable()
export class NWalletClientService {
    private subscriptions: Subscription[] = [];
    constructor(private logger: LoggerService, private http: HttpClient, private event: EventService, private token: TokenService) {}

    private getKeyFromValue(enums: {}, value: any): string {
        return Object.keys(enums).filter(type => enums[type] === value)[0];
    }

    public async fetchJobs(account: NWallet.Account): Promise<void> {
        this.logger.debug('[nclient] fetch jobs start');
        await this.getToken(account.signature.public);
        await this.fetchStreams(account);
        // const subscribe = this.subscribe(account);
        // const setAsset = this.refreshWallets(account);
        // await Promise.all([subscribe, setAsset]);
        this.logger.debug('[nclient] fetch jobs done');
    }

    private async getToken(accountId: string): Promise<string> {
        const token = await this.token.getToken(accountId);
        if (token) {
            return token.getAuth();
        }
    }

    public fetchStreams = async (account: NWallet.Account): Promise<boolean> => {
        return new Promise<boolean>(resolve => {
            const timer = Observable.timer(0, 5000);
            this.subscriptions.push(
                timer.subscribe(async () => {
                    const assets = await this.getAssets(account.signature.public);
                    account.wallets = account.wallets || [];
                    account.wallets.length = 0;
                    account.wallets.push(...assets);
                    this.event.publish(EventTypes.NWallet.account_refresh_wallet, assets);
                })
            );

            const subscription = timer.subscribe(async () => {
                resolve(true);
                subscription.unsubscribe();
            });

            this.subscriptions.push(subscription);
        });
    };

    public async unSubscribes(account: NWallet.Account): Promise<void> {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }

    public async getAssets(accountId: string): Promise<NWallet.AssetContext[]> {
        const convert = (datas: Object[]): NWallet.AssetContext[] => {
            return datas.map(data => {
                const asset = data['asset'];
                const amount = data['amount'];
                const item = getOrAddWalletItem(asset['code'], asset['issuer'], data['native']);
                item.price = data['price'];
                const wallet = <NWallet.AssetContext>{
                    item: item,
                    amount: amount
                };

                return wallet;
            });
        };

        return this.http
            .get(env.endpoint.api(`accounts/stellar/${accountId}`), {
                headers: {
                    Authorization: await this.getToken(accountId)
                }
            })
            .map(data => {
                const supportedCoins = convert(data['balances']['supportCoins']);
                const unSupportCoins = convert(data['balances']['unSupportCoins']);
                const returnCoins = supportedCoins.concat(unSupportCoins);
                return returnCoins;
            })
            .toPromise()
            .catch((error: HttpErrorResponse) => {
                this.logger.error('[nclient] get asset failed', error);
                return [];
            });
    }

    // tslint:disable-next-line:max-line-length
    private get = async <TResponse>(
        address: NWallet.Protocol.Types,
        accountId: string = '',
        expr: ParameterExpr<NWallet.Protocol.RequestBase> = undefined
    ): Promise<TResponse> => {
        const type = this.getKeyFromValue(NWallet.Protocol.Types, address);
        const request = expr ? createExpr(expr) : undefined;
        this.logger.debug(`[nclient] get ${type} ...`);

        return await this.http
            .get<TResponse>(env.endpoint.api(`${address}${accountId}`), {
                params: request,
                headers: {
                    Authorization: await this.getToken(accountId)
                }
            })
            .toPromise()
            .then(response => {
                this.logger.debug(`[nclient] get ${type} done`);
                return response;
            })
            .catch((response: HttpErrorResponse) => {
                this.logger.debug(`[nclient] get ${type} failed`, response);
                return undefined;
            });
    };

    public getTransfers = async (
        accountId: string,
        request: ParameterExpr<NWallet.Protocol.TransactionRequest>
    ): Promise<NWallet.Protocol.TransactionResponse> => {
        return await this.get<NWallet.Protocol.TransactionResponse>(NWallet.Protocol.Types.Transfer, accountId, request).then(response => {
            if (response) {
                const transactions = response.transactions.map(t => {
                    t.created_date = new Date(t.created_date);
                    return t;
                });

                response.transactions = transactions;
            }

            return response;
        });
    };

    public getCollaterals = async () => {
        return await this.get<NWallet.Protocol.Collateral[]>(NWallet.Protocol.Types.Collateral, '').then(collaterals => {
            if (collaterals && collaterals.length > 0) {
                collaterals = collaterals.map(e => {
                    e.created_date = new Date(e.created_date);
                    if (e.last_modified_date) {
                        e.last_modified_date = new Date(e.last_modified_date);
                    }
                    return e;
                });
            }

            return collaterals;
        });
    };

    public getCurrentLoanStatus = async (accountId: string): Promise<NWallet.Protocol.LoanStatusResponse> => {
        return await this.get<NWallet.Protocol.LoanStatusResponse>(NWallet.Protocol.Types.LoanStatus, accountId).then(response => {
            if (response) {
                const transactions = response.loans.map(e => {
                    e.loaned_date = new Date(e.loaned_date);
                    return e;
                });

                response.loans = transactions;
            }

            return response;
        });
    };

    public getLoanDetail = async (accountId: string, id: string): Promise<NWallet.Protocol.LoanStatusResponse> => {
        return await this.get<NWallet.Protocol.LoanStatusResponse>(NWallet.Protocol.Types.LoanStatus, `${accountId}/${id}`).then(response => {
            if (response) {
                const transactions = response.loans.map(e => {
                    e.loaned_date = new Date(e.loaned_date);
                    return e;
                });

                response.loans = transactions;
            }

            return response;
        });
        const asd = '';
    };
    public async getTransactions(accountId: string, asset: Asset, pageToken?: string): Promise<NWallet.Transactions.Context> {
        const params = {
            limit: pageToken ? '10' : '15',
            order: 'desc',
            asset_code: asset.getCode()
        };

        if (pageToken) {
            params['cursor'] = pageToken;
        }

        this.logger.debug('[nclient] request getTransaction ...');

        return this.http
            .get(env.endpoint.api(`transactions/stellar/accounts/${accountId}`), {
                params: params,
                headers: {
                    Authorization: await this.getToken(accountId)
                }
            })
            .map(response => {
                const transactions = response['transactions'];
                const token = response['paging_token'];
                const records = NWallet.Transactions.parseRecords(asset, transactions);
                return <NWallet.Transactions.Context>{
                    records: records,
                    pageToken: token,
                    hasNext: records && records.length > 0
                };
            })
            .toPromise()
            .then(context => {
                this.logger.debug('[nclient] request getTransaction done');
                return context;
            })
            .catch((response: HttpErrorResponse) => {
                this.logger.error('[nclient] request getTransaction failed', params, response);
                return undefined;
            });
    }
}
