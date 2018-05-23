// steller sdk wrapper
import Stellar, { TransactionBuilder, Asset, Keypair } from 'stellar-sdk';
import { Injectable } from '@angular/core';

// 토큰 발행자
const issueAccount = {
    type: 'ed25519',
    Key: 'GCOXH4BOXGPKYA62LOT4F4BRVKR2U2DFKTCOQ6JBMJDBLWK3ARMRJDKK',
    secretKey: 'SDNFVSYIJ4HZLDWIOJBMZXUAW2E2HWDQCEBB4UOMRKYF4IVKGIQ5SLOX',
};

// 토큰 배포자
const distributeAccount = {
    type: 'ed25519',
    Key: 'GAI2X4RPAQU3NXYCAFWRF37B2J4ZEYUCKN5SUJR2TR65SPSZWWC3NAEI',
    secretKey: 'SCNQ23LX3GST3IV3NRQWZDAADPHDMIQJDGMU6RHMLARFD76QLUJ5HX2X',
};

const serverAddress = {
    live: 'https://horizon.stellar.org',
    test: 'https://horizon-testnet.stellar.org',
};

const serverId = serverAddress.test;

const nSky = new Asset('nSky432', issueAccount.Key);

function StellarServer(): Stellar.Server {
    return new Stellar.Server(serverId);
}

@Injectable()
export class ConnectProvider {
    private issuer = issueAccount;
    private distributer = distributeAccount;
    constructor() {
        Stellar.Network.useTestNetwork();
        this.init();
    }

    async init(): Promise<void> {
        // await this.createAccount();

        // await this.createTokenTrust();
        // await this.issueToken();
        // await this.createAccount();
        // await this.payment();

        // const account = await server.loadAccount(this.issuer.Key);
        // console.log(account);
        // account = await server.loadAccount(this.distributer.Key);
        // console.log(account);

        console.log('done');
    }

    async createAccount(): Promise<void> {
        const server = StellarServer();
        const issuer = await server.loadAccount(this.issuer.Key);

        const destination = Keypair.random();
        console.log('pair ', destination.publicKey());
        console.log('pair ', destination.secret());

        const transaction = new TransactionBuilder(issuer)
            .addOperation(
                Stellar.Operation.createAccount({
                    destination: destination.publicKey(),
                    startingBalance: '1234',
                }),
            )
            .build();

        transaction.sign(Keypair.fromSecret(this.issuer.secretKey));
        const response = await server.submitTransaction(transaction);
        console.log(response);
    }

    async Inflation(): Promise<void> {
        const server = StellarServer();
        const issuer = await server.loadAccount(this.issuer.Key);

        const transaction = new TransactionBuilder(
            await server.loadAccount(issuer.accountId()),
        )
            .addOperation(Stellar.Operation.inflation({}))
            .build();

        transaction.sign(Keypair.fromSecret(this.issuer.secretKey));
        const response = await server.submitTransaction(transaction);
        console.log(response);
    }

    async createTokenTrust(): Promise<void> {
        const server = StellarServer();
        const distributer = await server.loadAccount(this.distributer.Key);
        const transaction = new TransactionBuilder(distributer)
            .addOperation(
                Stellar.Operation.changeTrust({
                    asset: nSky,
                    limit: '1000000',
                }),
            )
            .build();

        transaction.sign(Keypair.fromSecret(this.distributer.secretKey));
        const response = await server.submitTransaction(transaction);
        console.log(response);
    }

    async issueToken(): Promise<void> {
        const server = StellarServer();
        const issuer = await server.loadAccount(this.issuer.Key);
        const transaction = new TransactionBuilder(issuer)
            .addOperation(
                Stellar.Operation.payment({
                    destination: this.distributer.Key,
                    asset: nSky,
                    amount: '1000000',
                }),
            )
            .build();

        transaction.sign(Keypair.fromSecret(this.issuer.secretKey));
        const response = await server.submitTransaction(transaction);
        console.log(response);
    }

    async payment(): Promise<void> {
        const server = StellarServer();
        const distributer = await server.loadAccount(this.distributer.Key);
        const transaction = new TransactionBuilder(distributer)
            .addOperation(
                Stellar.Operation.payment({
                    destination: this.issuer.Key,
                    asset: nSky,
                    amount: '999999',
                }),
            )
            .build();

        transaction.sign(Keypair.fromSecret(this.distributer.secretKey));
        const response = await server.submitTransaction(transaction);
        console.log(response);
    }

    // async setOption(): Promise<void> {
    //     const server = StellarServer();
    //     const transaction = new TransactionBuilder(issuer)
    //     .addOperation(Stellar.Operation.setOptions({
    //         inflationDest : issuer.accountId(),
    //     }));
    // }
}
