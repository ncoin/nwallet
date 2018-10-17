import { Subscription } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Asset } from 'stellar-sdk';
import { Injectable } from '@angular/core';
import { LoggerService } from '../common/logger/logger.service';
import { env } from '../../environments/environment';
import { NWallet } from '../../interfaces/nwallet';
import { EventService } from '../common/event/event';
import { TokenService } from '../token/token.service';
import { ParameterExpr, createExpr } from 'forge';

import * as _ from 'lodash';
import { NWAsset } from '../../models/nwallet';

@Injectable()
export class NClientProvider {
    private subscriptions: Subscription[] = [];
    constructor(private logger: LoggerService, private http: HttpClient, private event: EventService, private token: TokenService) {}

    private onError<T>(log: string, result: T | undefined) {
        return (error: HttpErrorResponse) => {
            this.logger.error(`[nclient] ${log}`, error);
            return result;
        };
    }

    private getKeyFromValue(enums: {}, value: any): string {
        return Object.keys(enums).filter(type => enums[type] === value)[0];
    }

    private async getToken(): Promise<string> {
        const token = await this.token.getToken();
        if (token) {
            return token.getAuth();
        }
    }

    public fetchStreams = async (): Promise<boolean> => {
        return true;
    }

    public async unSubscribes(account: NWallet.Account): Promise<void> {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }

    public async getAssets(): Promise<NWAsset.Item[]> {
        return this.http
            .get<NWAsset.Data[]>(env.endpoint.api(`wallets`), {
                headers: {
                    authorization: await this.getToken()
                }
            })
            .toPromise()
            .then(datas => datas.map(data => new NWAsset.Item().toProtocol(data)))
            .catch(this.onError('get asset failed', []));
    }

    // tslint:disable-next-line:max-line-length
    private get = async <TResponse>(address: NWallet.Protocol.Types, accountId: string = '', expr: ParameterExpr<NWallet.Protocol.RequestBase> = undefined): Promise<TResponse> => {
        const type = this.getKeyFromValue(NWallet.Protocol.Types, address);
        const request = expr ? createExpr(expr) : undefined;
        this.logger.debug(`[nclient] get ${type} ...`);

        return await this.http
            .get<TResponse>(env.endpoint.api(`${address}${accountId}`), {
                params: request,
                headers: {
                    authorization: await this.getToken()
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
    }

    public getTransfers = async (accountId: string, request: ParameterExpr<NWallet.Protocol.TransactionRequest>): Promise<NWallet.Protocol.TransactionResponse> => {
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
    }

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
    }

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
    }

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
    }

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
                    authorization: await this.getToken()
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
