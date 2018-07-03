import { Subscription, Observable } from 'rxjs/Rx';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CurrencyProvider } from './../currency/currency';
// steller sdk wrapper
import Stellar, { Asset } from 'stellar-sdk';
import { Injectable, NgZone } from '@angular/core';
import { Logger } from './../common/logger/logger';
import { env } from '../../environments/environment';
import { NWallet, getOrAddWalletItem } from '../../interfaces/nwallet';

//todo environment schema --sky
const apiAddress = {
    live: 'http://wallet-api-dev.ncoin.com:3000/api/',
    test: 'http://wallet-api-dev.ncoin.com:3000/api/',
};

//todo inject by env? --sky
const endPoint = {
    url: '',
};

@Injectable()
export class NClientProvider {
    /** <public key, eventSource> */
    private paymentSubscriptions: Map<string, Subscription>;

    constructor(private zone: NgZone, private logger: Logger, private currency: CurrencyProvider, private http: HttpClient) {
        this.currency;
        this.paymentSubscriptions = new Map<string, Subscription>();
        this.init();
    }

    async init(): Promise<void> {
        if (env.network === 'test') {
            //todo move location
            Stellar.Network.useTestNetwork();
            endPoint.url = apiAddress.test;
        } else {
            endPoint.url = apiAddress.live;
            //todo move location
            Stellar.Network.usePublicNetwork();
        }
    }

    public requestTrustXDR = (accountId: string): Promise<string> => {
        this.logger.debug('[nclient] request trust XDR ...');
        return this.http
            .post(`${endPoint.url}trusts/xlm/xdr`, {
                public_key: accountId,
            })
            .map(res => res['xdr'])
            .toPromise()
            .then(xdr => {
                this.logger.debug('[nclient] request trust XDR success');
                return xdr;
            })
            .catch((response: HttpErrorResponse) => {
                this.logger.error('[nclient] request trust XDR failed.', response);
                return undefined;
            });
    };

    public executeTrustXDR = (accountId: string, xdr: string): Promise<string> => {
        this.logger.debug('[nclient] execute trust XDR ...');

        return this.http
            .put(`${endPoint.url}trusts/xlm/xdr`, {
                xdr: xdr,
                public_key: accountId,
            })
            .map(res => res.toString())
            .toPromise()
            .then(response => {
                this.logger.debug('[nclient] execute trust XDR success');
                return response;
            })
            .catch((response: HttpErrorResponse) => {
                this.logger.error('[nclient] execute trust XDR failed', response);
                return undefined;
            });
    };

    public getAssets(accountId: string): Promise<NWallet.WalletContext[]> {
        const url = `${apiAddress.test}accounts/xlm/${accountId}`;
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
                const supportedCoins = convert(data['account']['balances']['supportCoins']);
                const unSupportCoins = convert(data['account']['balances']['unSupportCoins']);
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
            limit: '10',
            order: 'desc',
        };

        if (pageToken) {
            params['cursor'] = pageToken;
        }

        return this.http
            .get(`${endPoint.url}transactions/xlm/accounts/${accountId}`, { params: params })
            .map(response => {
                const transaction = response['transaction'];
                const records = NWallet.Transactions.parseRecords(asset, transaction);
                const token = transaction['paging_token'];
                return <NWallet.Transactions.Context>{
                    records: records,
                    pageToken: token,
                    hasNext: records && records.length > 0,
                };
            })
            .toPromise()
            .catch((response: HttpErrorResponse) => {
                this.logger.error('[nclient] getTransaction failed', response);
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

    //todo method merge (XDRs)
    public requestBuyXDR = (accountId: string, asset: Asset, amount: number): Promise<string> => {
        this.logger.debug('[nclient] request buy ...');

        return this.http
            .post(`${endPoint.url}buys/nch/xdr`, {
                public_key: accountId,
                amount: amount,
                asset_code: asset.getCode(),
            })
            .map(res => res['xdr'])
            .toPromise().then(response => {
                this.logger.debug('[nclient] request buy success');
                return response;
            }).catch((response:HttpErrorResponse) => {
                this.logger.error('[nclient] request buy failed', response);
            });
    };

    public executeBuyXDR = (accoundId:string, xdr: string): Promise<string> => {
        this.logger.debug('[nclient] execute buy ...');

        return this.http
            .put(`${endPoint.url}buys/nch/xdr`, {
                xdr: xdr,
                public_key : accoundId,
            })
            .toPromise().then(response => {
                this.logger.debug('[nclient] execute buy success', response);
                return response;
            }).catch((response:HttpErrorResponse)=> {
                this.logger.debug('[nclient] execute buy failed', response);
                return undefined;
            });
    };

    public requestLoanXDR = (accountId: string, asset: Asset, amount: number): Promise<string> => {
        this.logger.debug('[nclient] request loan ...');

        return this.http
            .post(`${endPoint.url}loans/nch/xdr`, {
                public_key: accountId,
                amount: amount,
                asset_code: asset.getCode(),
            })
            .map(res => res['xdr'])
            .toPromise()
            .then(response => {
                this.logger.debug('[nclient] request loan success', response);
                return response;
            })
            .catch((response:HttpErrorResponse) => {
                this.logger.error('[nclient] request loan failed', response);
            });
    };

    public executeLoanXDR = (accountId: string, xdr: string): Promise<string> => {
        this.logger.debug('[nclient] execute loan ...');

        return this.http
            .put(`${endPoint.url}loans/nch/xdr`, {
                xdr: xdr,
                public_key: accountId,
            })
            .map(res => res.toString())
            .toPromise().then(response => {
                this.logger.debug('[nclient] execute loan success');
                return response;
            }).catch((response:HttpErrorResponse)=> {
                this.logger.debug('[nclient] execute loan failed', response);
                return undefined;
            });
    };
}
