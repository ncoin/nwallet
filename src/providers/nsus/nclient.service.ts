import { Subscription } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoggerService } from '../common/logger/logger.service';
import { env } from '../../environments/environment';
import { EventService } from '../common/event/event';
import { TokenService } from '../token/token.service';
import { ParameterExpr, createExpr } from 'forge';

import * as _ from 'lodash';
import { GetRequestBase, PutRequestBase } from '../../models/nwallet/http-protocol-base';

@Injectable()
export class NClientService {
    private subscriptions: Subscription[] = [];
    constructor(private logger: LoggerService, private http: HttpClient, private event: EventService, private token: TokenService) {}

    private async getToken(): Promise<string> {
        this.logger.debug('[nclient] request token');
        const token = await this.token.getToken();
        if (token) {
            return token.getAuth();
        }
    }

    public fetchStreams = async (): Promise<boolean> => {
        return true;
    };

    public async unSubscribes(): Promise<void> {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }

    public async get<TRequest, TResponse>(request: GetRequestBase<TRequest, TResponse>): Promise<TResponse> {
        this.logger.debug(`[nclient] execute protocol : ${request.name}`);
        return this.http
            .get<TResponse>(env.endpoint.api(request.url()), {
                headers: {
                    authorization: await this.getToken()
                }
            })
            .toPromise();
    }

    public async put<TRequest>(request: PutRequestBase<TRequest>): Promise<Object> {
        this.logger.debug(`[nclient] execute protocol : ${request.name}`);
        return this.http
            .put(env.endpoint.api(request.url()), request.payload, {
                headers: {
                    authorization: await this.getToken()
                }
            })
            .toPromise();
    }

    // tslint:disable-next-line:max-line-length
    // private get = async <TResponse>(address: NWProtocol.Types, expr: ParameterExpr<NWProtocol.RequestBase> = undefined): Promise<TResponse> => {
    //     const type = this.getKeyFromValue(NWProtocol.Types, address);
    //     const request = expr ? createExpr(expr) : undefined;
    //     this.logger.debug(`[nclient] get ${type} ...`);

    //     return await this.http
    //         .get<TResponse>(env.endpoint.api(`${address}`), {
    //             params: request,
    //             headers: {
    //                 authorization: await this.getToken()
    //             }
    //         })
    //         .toPromise()
    //         .then(response => {
    //             this.logger.debug(`[nclient] get ${type} done`);
    //             return response;
    //         })
    //         .catch((response: HttpErrorResponse) => {
    //             this.logger.debug(`[nclient] get ${type} failed`, response);
    //             throw new NWHttpError(response);
    //         });
    // }

    // public getTransfers = async (accountId: string, request: ParameterExpr<NWallet.Protocol.TransactionRequest>): Promise<NWallet.Protocol.TransactionResponse> => {
    //     return await this.get<NWallet.Protocol.TransactionResponse>(NWallet.Protocol.Types.Transfer, accountId, request).then(response => {
    //         if (response) {
    //             const transactions = response.transactions.map(t => {
    //                 t.created_date = new Date(t.created_date);
    //                 return t;
    //             });

    //             response.transactions = transactions;
    //         }

    //         return response;
    //     });
    // }

    // public getCollaterals = async () => {
    //     return await this.get<NWallet.Protocol.Collateral[]>(NWallet.Protocol.Types.Collateral, '').then(collaterals => {
    //         if (collaterals && collaterals.length > 0) {
    //             collaterals = collaterals.map(e => {
    //                 e.created_date = new Date(e.created_date);
    //                 if (e.last_modified_date) {
    //                     e.last_modified_date = new Date(e.last_modified_date);
    //                 }
    //                 return e;
    //             });
    //         }

    //         return collaterals;
    //     });
    // }

    // public getLoanDetail = async (accountId: string, id: string): Promise<NWallet.Protocol.LoanStatusResponse> => {
    //     return await this.get<NWallet.Protocol.LoanStatusResponse>(NWProtocol.Types.LoanStatus, `${accountId}/${id}`).then(response => {
    //         if (response) {
    //             const transactions = response.loans.map(e => {
    //                 e.loaned_date = new Date(e.loaned_date);
    //                 return e;
    //             });

    //             response.loans = transactions;
    //         }

    //         return response;
    //     });
    // }

    // public async getTransactions(accountId: string, asset: Asset, pageToken?: string): Promise<NWallet.Transactions.Context> {
    //     const params = {
    //         limit: pageToken ? '10' : '15',
    //         order: 'desc',
    //         asset_code: asset.getCode()
    //     };

    //     if (pageToken) {
    //         params['cursor'] = pageToken;
    //     }

    //     this.logger.debug('[nclient] request getTransaction ...');

    //     return this.http
    //         .get(env.endpoint.api(`transactions/stellar/accounts/${accountId}`), {
    //             params: params,
    //             headers: {
    //                 authorization: await this.getToken()
    //             }
    //         })
    //         .map(response => {
    //             const transactions = response['transactions'];
    //             const token = response['paging_token'];
    //             const records = NWallet.Transactions.parseRecords(asset, transactions);
    //             return <NWallet.Transactions.Context>{
    //                 records: records,
    //                 pageToken: token,
    //                 hasNext: records && records.length > 0
    //             };
    //         })
    //         .toPromise()
    //         .then(context => {
    //             this.logger.debug('[nclient] request getTransaction done');
    //             return context;
    //         })
    //         .catch((response: HttpErrorResponse) => {
    //             this.logger.error('[nclient] request getTransaction failed', params, response);
    //             return undefined;
    //         });
    // }
}