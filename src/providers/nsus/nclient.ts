import { EventTypes } from '../../interfaces/events';
import { Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Asset } from 'stellar-sdk';
import { Injectable } from '@angular/core';
import { Logger } from '../common/logger/logger';
import { env } from '../../environments/environment';
import { NWallet, getOrAddWalletItem } from '../../interfaces/nwallet';
import { EventProvider } from '../common/event/event';

@Injectable()
export class NClientProvider {
    constructor(private logger: Logger, private http: HttpClient, private event: EventProvider) {}

    private getKeyFromValue(enums: {}, value: any): string {
        return Object.keys(enums).filter(type => enums[type] === value)[0];
    }

    public async fetchJobs(account: NWallet.Account): Promise<void> {
        this.logger.debug('[nclient] fetch jobs start');
        await this.fetchStreams(account);
        // const subscribe = this.subscribe(account);
        // const setAsset = this.refreshWallets(account);
        // await Promise.all([subscribe, setAsset]);
        this.logger.debug('[nclient] fetch jobs done');
    }

    public fetchStreams = (account: NWallet.Account): Promise<boolean> => {
        return new Promise<boolean>(resolve => {
            const assetRefresh = Observable.timer(0, 5000).mergeMap(() => this.getAssets(account.signature.public));
            assetRefresh.subscribe(wallet => {
                account.wallets = account.wallets || [];
                account.wallets.length = 0;
                account.wallets.push(...wallet);
                this.event.publish(EventTypes.NWallet.account_refresh_wallet, wallet);
                resolve(true);
            });
        });
    };

    public async unSubscribes(account: NWallet.Account): Promise<void> {
        account;
    }

    public getAssets(accountId: string): Observable<NWallet.AssetContext[]> {
        const url = `${env.endpoint.client}accounts/stellar/${accountId}`;
        const convert = (data: Object[]): NWallet.AssetContext[] => {
            return data.map(data => {
                const asset = data['asset'];
                const amount = data['amount'];
                const item = getOrAddWalletItem(asset['code'], asset['issuer'], data['native']);
                item.price = data['price'];
                const wallet = <NWallet.AssetContext>{
                    item: item,
                    amount: amount,
                };

                return wallet;
            });
        };

        return this.http.get(url).map(data => {
            const supportedCoins = convert(data['balances']['supportCoins']);
            const unSupportCoins = convert(data['balances']['unSupportCoins']);
            const returnCoins = supportedCoins.concat(unSupportCoins);
            return returnCoins;
        });
    }

    public async getTransactions(accountId: string, asset: Asset, pageToken?: string): Promise<NWallet.Transactions.Context> {
        const params = {
            limit: pageToken ? '10' : '15',
            order: 'desc',
            asset_code: asset.getCode(),
        };

        if (pageToken) {
            params['cursor'] = pageToken;
        }

        this.logger.debug('[nclient] request getTransaction ...');

        return this.http
            .get(`${env.endpoint.client}transactions/stellar/accounts/${accountId}`, { params: params })
            .map(response => {
                const transactions = response['transactions'];
                const token = response['paging_token'];
                const records = NWallet.Transactions.parseRecords(asset, transactions);
                return <NWallet.Transactions.Context>{
                    records: records,
                    pageToken: token,
                    hasNext: records && records.length > 0,
                };
            })
            .toPromise()
            .then(context => {
                this.logger.debug('[nclient] request getTransaction done', context);
                return context;
            })
            .catch((response: HttpErrorResponse) => {
                this.logger.error('[nclient] request getTransaction failed', params, response);
                return undefined;
            });
    }

    public requestXDR = (requestType: NWallet.Protocol.XdrRequestTypes, params: Object): Promise<NWallet.Protocol.XDRResponse> => {
        const type = this.getKeyFromValue(NWallet.Protocol.XdrRequestTypes, requestType);
        this.logger.debug(`[nclient] request get ${type} xdr ...`);
        return this.http
            .post(`${env.endpoint.client}${requestType}`, params)
            .toPromise()
            .then((response: NWallet.Protocol.XDRResponse) => {
                this.logger.debug(`[nclient] request get ${type} xdr done`);
                return response;
            })
            .catch((response: HttpErrorResponse) => {
                this.logger.error(`[nclient] request get ${type} xdr failed`, response);
                return undefined;
            });
    };

    public executeXDR = (requestType: NWallet.Protocol.XdrRequestTypes, params: Object): Promise<boolean> => {
        const type = this.getKeyFromValue(NWallet.Protocol.XdrRequestTypes, requestType);
        this.logger.debug(`[nclient] execute ${type} xdr ...`);
        return this.http
            .put(`${env.endpoint.client}${requestType}`, params)
            .toPromise()
            .then(response => {
                this.logger.debug(`[nclient] execute ${type} xdr done`);
                return response['success'];
            })
            .catch((response: HttpErrorResponse) => {
                this.logger.error(`[nclient] execute ${type} xdr failed`, response);
                return false;
            });
    };
}
