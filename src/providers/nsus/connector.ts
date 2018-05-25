// steller sdk wrapper
import Stellar, { TransactionBuilder, Asset, Keypair } from 'stellar-sdk';
import { Injectable } from '@angular/core';
import { Logger } from './../common/logger/logger';
import { env } from '../../environments/environment';
import { NWallet } from '../../interfaces/nwallet';

const serverAddress = {
    live: 'https://horizon.stellar.org',
    test: 'https://horizon-testnet.stellar.org',
};

const nSky = new Asset('nSky432', 'GCOXH4BOXGPKYA62LOT4F4BRVKR2U2DFKTCOQ6JBMJDBLWK3ARMRJDKK');

@Injectable()
export class ConnectProvider {
    private server: Stellar.Server;
    constructor(private logger: Logger) {
        this.init();
        nSky;
    }

    async init(): Promise<void> {
        if (env.isTestNetwork) {
            this.server = new Stellar.Server(serverAddress.test);
        } else {
            Stellar.Network.useTestNetwork();
            this.server = new Stellar.Server(serverAddress.live);
        }
    }

    public getAssets(accountId: string): Promise<NWallet.WalletItem[]> {
        return this.server.loadAccount(accountId)
        .then(account => {
            return account.balances.map<NWallet.WalletItem>(asset => {
                if (asset.asset_type === 'native'){
                    return {
                        asset: Asset.native(),
                        amount: asset.balance,
                    }
                }

                return {
                    asset: new Asset(asset.asset_code, asset.asset_issuer),
                    amount: asset.balance
                }
            });
        })
        .catch(error => {
            this.logger.debug(error);
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
                this.logger.debug(error);
                return false;
            });
    }

    public async createAccount(): Promise<NWallet.Signature> {
        const kp = Keypair.random();
        return <NWallet.Signature>{
            public: kp.publicKey(),
            secret: kp.secret(),
        };
    }

    //todo: transaction refactoring --sky
    public async sendPayment(
        sourceAccount: NWallet.Signature,
        destination: string,
        walletItem: NWallet.WalletItem,
        amount: string
    ) {

        const source = await this.server.loadAccount(sourceAccount.public);
        const transaction = new TransactionBuilder(source);

        //todo: change trust
        if (await this.isExistAccount(destination)) {
            transaction.addOperation(
                Stellar.Operation.payment({
                    destination: destination,
                    asset: walletItem.asset,
                    amount: amount
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

    // async createTokenTrust(): Promise<void> {
    //     const distributer = await this.server.loadAccount(this.distributer.Key);
    //     const transaction = new TransactionBuilder(distributer)
    //         .addOperation(
    //             Stellar.Operation.changeTrust({
    //                 asset: nSky,
    //                 limit: '1000000',
    //             }),
    //         )
    //         .build();

    //     transaction.sign(Keypair.fromSecret(this.distributer.secretKey));
    //     const response = await this.server.submitTransaction(transaction);
    //     console.log(response);
    // }

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
