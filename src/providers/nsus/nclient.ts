import { Subscription, Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';
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
        return this.http
            .post(`${endPoint.url}trusts/xdr`, {
                publicKey: accountId,
            })
            .map(res => res['xdr'])
            .toPromise()
            .catch(error => {
                this.logger.error('request trust failed.', error);
                return undefined;
            });
    };

    public executeTrustXDR = (xdr: string): Promise<string> => {
        return this.http
            .put(`${endPoint.url}trusts/xdr`, {
                xdr: xdr,
            })
            .map(res => res.toString())
            .toPromise()
            .catch(error => {
                this.logger.error('getTrustXDR failed', error);
                return undefined;
            });
    };

    public getAssets(accountId: string): Promise<NWallet.WalletContext[]> {
        const url = `${apiAddress.test}accounts/${accountId}`;
        const convert = (data: Object[]): NWallet.WalletContext[] => {
            return data.map(data => {
                const asset = data['asset'];
                const amount = data['amount'];
                const item = getOrAddWalletItem(asset['code'], asset['issuer'], data['native']);
                item.price = data['price'];
                const wallet = <NWallet.WalletContext>{
                    item : item,
                    amount : amount
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
            .catch(error => {
                this.logger.error('getAsset failed', error);
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
            .get(`${endPoint.url}transactions/accounts/${accountId}`, { params: params })
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
            .toPromise();
    }

    public async refreshWallets(account: NWallet.Account): Promise<void> {
        this.getAssets(account.signature.public).then(wallets => {
            this.logger.debug('refresh Wallets', wallets);

            //todo fixme --sky`

            wallets.filter(wallet => wallet.amount);

            //todo check equality then zone run --sky`
            this.zone.run(() => {
                account.wallets = wallets;
            });
        });
    }

    public async fetchJobs(account: NWallet.Account): Promise<void> {
        this.logger.debug('fetch jobs start');
        this.subscribe(account);
        // const subscribe = this.subscribe(account);
        // const setAsset = this.refreshWallets(account);
        // await Promise.all([subscribe, setAsset]);
        this.logger.debug('fetch jobs done');
    }

    public subscribe = (account: NWallet.Account): void => {
        const subscription = Observable.timer(0, 5000).subscribe(() => {
            this.refreshWallets(account);
        });

        this.paymentSubscriptions.set(account.signature.public, subscription);
    }

    public subscribelegacy(account: NWallet.Account): void {
        // const payment = this.server.payments().forAccount(account.signature.public);
        // const self = this;
        // this.paymentSubscriptions.set(
        //     account.signature.public,
        //     //todo get lastest paging token --sky`
        //     payment.stream({
        //         onmessage: function() {
        //             //argument[0] => payment transactions
        //             self.logger.debug('subscibe', arguments[0]);

        //             if (self.isFetched) {
        //                 self.refreshWallets(account);
        //             }
        //         },
        //         onerror: function() {
        //             self.logger.debug('subscribe error, maybe account not activate yet');
        //         },
        //     }),
        //);

        this.logger.debug('subscribed', account.signature.public);
    }

    public async unSubscribe(account: NWallet.Account): Promise<void> {
        const unSubscribePayment = this.paymentSubscriptions.get(account.signature.public);

        if (unSubscribePayment) {
            unSubscribePayment.unsubscribe();
            this.logger.debug('payment subscription closed');
        }
    }

    //todo method merge (XDRs)
    public requestBuyXDR = (accountId: string, asset: Asset, amount: number): Promise<string> => {
        return this.http
            .post(`${endPoint.url}buys/xdr`, {
                publicKey: accountId,
                amount: amount,
                assetCode: asset.getCode(),
            })
            .map(res => res['xdr'])
            .toPromise();
    };

    public executeBuyXDR = (xdr: string): Promise<string> => {
        return this.http
            .put(`${endPoint.url}buys/xdr`, {
                xdr: xdr,
            })
            .map(res => res.toString())
            .toPromise();
    };

    //todo method merge
    public requestLoanXDR = (accountId: string, asset: Asset, amount: number): Promise<string> => {
        return this.http
            .post(`${endPoint.url}loans/xdr`, {
                publicKey: accountId,
                amount: amount,
                assetCode: asset.getCode(),
            })
            .map(res => res['xdr'])
            .toPromise()
            .catch(error => {
                this.logger.error('request loan failed', error);
            });
    };

    public executeLoanXDR = (xdr: string): Promise<string> => {
        return this.http
            .put(`${endPoint.url}loans/xdr`, {
                xdr: xdr,
            })
            .map(res => res.toString())
            .toPromise();
    };
}
