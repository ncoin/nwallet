import { CurrencyProvider, CurrencyId } from './../currency/currency';
// steller sdk wrapper
import Stellar, { TransactionBuilder, Asset, Keypair } from 'stellar-sdk';
import { Injectable, NgZone } from '@angular/core';
import { Logger } from './../common/logger/logger';
import { env } from '../../environments/environment';
import { NWallet } from '../../interfaces/nwallet';

const serverAddress = {
    live: 'https://horizon.stellar.org',
    test: 'https://horizon-testnet.stellar.org',
};

@Injectable()
export class NClientProvider {
    private server: Stellar.Server;
    private isFetched: boolean;
    /** <public key, eventSource> */
    private paymentSubscriptions: Map<string, any>;

    constructor(private zone: NgZone, private logger: Logger, private currency: CurrencyProvider) {
        this.init();
        this.paymentSubscriptions = new Map<string, any>();
    }

    async init(): Promise<void> {
        if (env.network === 'test') {
            Stellar.Network.useTestNetwork();
            this.server = new Stellar.Server(serverAddress.test);
        } else {
            this.server = new Stellar.Server(serverAddress.live);
        }
    }

    public getAssets(accountId: string): Promise<NWallet.WalletItem[]> {
        return this.server
            .loadAccount(accountId)
            .then(account => {
                return account.balances.map<NWallet.WalletItem>(asset => {
                    this.logger.debug('asset', asset);
                    if (asset.asset_type === 'native') {
                        return {
                            asset: Asset.native(),
                            amount: asset.balance,
                            price: this.currency.getCurrencyInfo(CurrencyId.XLM).getValue().price,
                        };
                    }

                    const isEqual = (dest: Asset) => {
                        return asset.asset_code === dest.getCode() && asset.asset_issuer === dest.getIssuer() && asset.asset_type === NWallet.NCH.getAssetType();
                    };

                    let price: number = 0;

                    //poc code
                    if (isEqual(NWallet.NCN)) {
                        price = this.currency.getCurrencyInfo("-2").getValue().price;
                    }

                    if (isEqual(NWallet.NCH)) {
                        price = this.currency.getCurrencyInfo("-1").getValue().price;
                    }

                    return {
                        asset: new Asset(asset.asset_code, asset.asset_issuer),
                        amount: asset.balance,
                        price: 0,
                    };
                });
            })
            .catch(error => {
                this.logger.error('get asset error', error);
                return NWallet.WalletEmpty;
            });
    }

    public isExistAccount(accountId: string): Promise<boolean> {
        return this.server
            .accounts()
            .accountId(accountId) //load account?
            .call()
            .then(record => {
                this.logger.debug(record);
                return true;
            })
            .catch(error => {
                this.logger.error('isExistAccountError', error);
                return false;
            });
    }

    //todo: transaction refactoring --sky
    public async sendPayment(signature: NWallet.Signature, destination: string, asset: Asset, amount: string) {
        const source = await this.server.loadAccount(signature.public);
        const transaction = new TransactionBuilder(source);
        //todo: change trust
        if (await this.isExistAccount(destination)) {
            transaction.addOperation(
                Stellar.Operation.payment({
                    destination: destination,
                    asset: asset,
                    amount: amount,
                }),
            );
        } else {
            transaction.addOperation(
                Stellar.Operation.createAccount({
                    destination: destination,
                    startingBalance: amount,
                }),
            );
        }

        const tran = transaction.build();
        tran.sign(Keypair.fromSecret(signature.secret));
        this.server.submitTransaction(tran);
    }

    public async refreshWallets(account: NWallet.Account): Promise<void> {
        this.getAssets(account.signature.public).then(wallets => {
            this.logger.debug('refresh Wallets');
            //todo check equality then zone run --sky`

            this.zone.run(() => {
                account.wallets = wallets;
            });
        });
    }

    public async fetchJobs(account: NWallet.Account): Promise<void> {
        this.logger.debug('fetch jobs start');
        const subscribe = this.subscribe(account);
        const setAsset = this.refreshWallets(account);
        await Promise.all([subscribe, setAsset]);
        this.isFetched = true;
        this.logger.debug('fetch jobs done');
    }

    public async subscribe(account: NWallet.Account): Promise<void> {
        const payment = await this.server.payments().forAccount(account.signature.public);
        const self = this;
        this.paymentSubscriptions.set(
            account.signature.public,
            //todo get lastest paging token --sky`
            payment.stream({
                onmessage: function() {
                    //argument[0] => payment transactions
                    self.logger.debug('subscibe', arguments[0]);

                    if (self.isFetched) self.refreshWallets(account);
                },
                onerror: function() {
                    self.logger.debug('subscribe error, maybe account not activate yet');
                },
            }),
        );

        this.logger.debug('subscribed', account.signature.public);
    }

    public async unSubscribe(account: NWallet.Account): Promise<void> {
        const unSubscribePayment = this.paymentSubscriptions.get(account.signature.public);

        if (unSubscribePayment) {
            unSubscribePayment();
            this.logger.debug('payment subscription closed');
        }
    }

    // public async createAccount2(): Promise<void> {
    //     const issuer = await this.server.loadAccount(this.issuer.Key);

    //     const destination = Keypair.random();
    //     console.log('pair ', destination.publicKey());
    //     console.log('pair ', destination.secret());

    //     const transaction = new TransactionBuilder(issuer)
    //         .addOperation(
    //             Stellar.Operation.createAccount({
    //                 destination: destination.publicKey(),
    //                 startingBalance: '1234',
    //             }),
    //         )
    //         .build();

    //     transaction.sign(Keypair.fromSecret(this.issuer.secretKey));
    //     const response = await this.server.submitTransaction(transaction);
    //     console.log(response);
    // }

    async createTokenTrust(account: NWallet.Account): Promise<void> {
        this.server
            .loadAccount(account.signature.public)
            .then(async distributer => {
                const transaction = new TransactionBuilder(distributer)
                    .addOperation(
                        Stellar.Operation.changeTrust({
                            asset: NWallet.NCH,
                            limit: '1000000',
                        }),
                    )
                    .addOperation(
                        Stellar.Operation.changeTrust({
                            asset: NWallet.NCN,
                            limit: '1000000',
                        }),
                    )
                    .build();

                transaction.sign(Keypair.fromSecret(account.signature.secret));
                const response = await this.server.submitTransaction(transaction);
                console.log(response);
            })
            .catch(err => {
                this.logger.debug('create trust error : ', err);
            });
    }

    // async issueToken(): Promise<void> {
    //     const issuer = await this.server.loadAccount(this.issuer.Key);
    //     const transaction = new TransactionBuilder(issuer)
    //         .addOperation(
    //             Stellar.Operation.payment({
    //                 destination: this.distributer.Key,
    //                 asset: nSky,
    //                 amount: '1000000',
    //             }),
    //         )
    //         .build();

    //     transaction.sign(Keypair.fromSecret(this.issuer.secretKey));
    //     const response = await this.server.submitTransaction(transaction);
    //     console.log(response);
    // }

    // async payment(): Promise<void> {
    //     const distributer = await this.server.loadAccount(this.distributer.Key);
    //     const transaction = new TransactionBuilder(distributer)
    //         .addOperation(
    //             Stellar.Operation.payment({
    //                 destination: this.issuer.Key,
    //                 asset: nSky,
    //                 amount: '999999',
    //             }),
    //         )
    //         .build();

    //     transaction.sign(Keypair.fromSecret(this.distributer.secretKey));
    //     const response = await this.server.submitTransaction(transaction);
    //     console.log(response);
    // }
}
