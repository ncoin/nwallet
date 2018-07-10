import { Subscription, Observable } from 'rxjs/Rx';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CurrencyProvider } from './../currency/currency';
// steller sdk wrapper
import Stellar, { Asset } from 'stellar-sdk';
import { Injectable, NgZone } from '@angular/core';
import { Logger } from './../common/logger/logger';
import { env } from '../../environments/environment';
import { NWallet, getOrAddWalletItem } from '../../interfaces/nwallet';

@Injectable()
export class NClientProvider {
    /** <public key, eventSource> */
    private paymentSubscriptions: Map<string, Subscription>;

    constructor(private zone: NgZone, private logger: Logger, private currency: CurrencyProvider, private http: HttpClient) {
        this.currency;
        this.paymentSubscriptions = new Map<string, Subscription>();
        this.init();
    }

    private getKeyFromValue(enums: {}, value: any): string {
        return Object.keys(enums).filter(type => enums[type] === value)[0];
    }

    async init(): Promise<void> {
        if (env.network === 'test') {
            //todo move location
            Stellar.Network.useTestNetwork();
        } else {
            //todo move location
            Stellar.Network.usePublicNetwork();
        }
    }

    public async fetchJobs(account: NWallet.Account): Promise<void> {
        this.logger.debug('[nclient] fetch jobs start');
        this.subscribe(account);
        // const subscribe = this.subscribe(account);
        // const setAsset = this.refreshWallets(account);
        // await Promise.all([subscribe, setAsset]);
        this.logger.debug('[nclient] fetch jobs done');
    }

    public subscribe = (account: NWallet.Account): void => {
        const subscription = Observable.timer(0, 5000).subscribe(() => {
            this.refreshWallets(account);
        });

        this.paymentSubscriptions.set(account.signature.public, subscription);
    };

    public async unSubscribe(account: NWallet.Account): Promise<void> {
        const unSubscribePayment = this.paymentSubscriptions.get(account.signature.public);

        if (unSubscribePayment) {
            unSubscribePayment.unsubscribe();
            this.logger.debug('[nclient] payment subscription closed');
        }
    }

    public getAssets(accountId: string): Promise<NWallet.WalletContext[]> {
        const url = `${env.endpoint.client}accounts/stellar/${accountId}`;
        const convert = (data: Object[]): NWallet.WalletContext[] => {
            return data.map(data => {
                const asset = data['asset'];
                const amount = data['amount'];
                const item = getOrAddWalletItem(asset['code'], asset['issuer'], data['native']);
                item.price = data['price'];
                const wallet = <NWallet.WalletContext>{
                    item: item,
                    amount: amount,
                };

                return wallet;
            });
        };

        return this.http
            .get(url)
            .map(data => {
                const supportedCoins = convert(data['balances']['supportCoins']);
                const unSupportCoins = convert(data['balances']['unSupportCoins']);
                const returnCoins = supportedCoins.concat(unSupportCoins);
                return returnCoins;
            })
            .toPromise()
            .catch((response: HttpErrorResponse) => {
                this.logger.error('[nclient] getAsset failed', response);
                return [];
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

    public async refreshWallets(account: NWallet.Account): Promise<void> {
        this.getAssets(account.signature.public).then(wallets => {
            this.logger.debug('[nclient] refresh wallets', wallets);

            //todo check equality then zone run --sky`
            this.zone.run(() => {
                account.wallets = account.wallets || [];
                account.wallets.length = 0;
                account.wallets.push(...wallets);
            });
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
