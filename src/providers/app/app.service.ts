import { AccountProvider } from './../account/account';
import { NClientProvider } from './../nsus/nclient';
import { Injectable } from '@angular/core';
import { PreferenceProvider, Preference } from '../common/preference/preference';
import { App } from 'ionic-angular';
import { Logger } from '../common/logger/logger';
import { NWallet } from '../../interfaces/nwallet';
import Stellar, { Asset, Keypair } from 'stellar-sdk';

interface Signable {
    sign(requestXDRfunc: (key: string) => Promise<string>): Signable;
    after: (afterfunction: (xdr: string) => Promise<string>) => Promise<string>;
}

/**
 * common config provider
 */
@Injectable()
export class AppServiceProvider {
    constructor(private preference: PreferenceProvider, private app: App, private logger: Logger, private connector: NClientProvider, private account: AccountProvider) {}

    public async flushApplication(): Promise<void> {
        await this.preference.clear();
    }

    public async tutorialRead(): Promise<void> {
        await this.preference.set(Preference.App.hasSeenTutorial, true);
    }

    public async login(account: NWallet.Account): Promise<void> {
        await this.connector.fetchJobs(account);
        this.signer.sign(this.connector.requestTrustXDR).after(this.connector.executeTrustXDR);
    }

    public async logout(account: NWallet.Account): Promise<void> {
        await this.preference.remove(Preference.Nwallet.walletAccount);
        await this.connector.unSubscribe(account);
        this.account.flush();
        this.logger.debug('logout', account.signature.public);
    }

    public async getTransactions(asset: Asset, pageToken?: string) {
        //todo fixme
        const account = await this.account.getAccount();
        return await this.connector.getTransactions(account.signature.public, asset, pageToken);
    }

    public async requestLoan(asset: Asset, amount: number): Promise<void> {
        this.signer.sign(key => this.connector.requestLoanXDR(key, asset, amount)).after(this.connector.executeLoanXDR);
    }

    public async requestBuy(asset: Asset, amount: number): Promise<void> {
        this.signer.sign(key => this.connector.requestBuyXDR(key, asset, amount)).after(this.connector.executeBuyXDR);
    }

    private get signer(): Signable {
        const signer = {
            requestXDR: undefined,
            sign: (requstXDRexpr: (accountId: string) => Promise<string>): Signable => {
                signer.requestXDR = requstXDRexpr;
                return signer;
            },
            after: async (afterfunction: (xdr: string) => Promise<string>): Promise<string> => {
                const account = await this.account.getAccount();
                const signedXDR = await signer.requestXDR(account.signature.public).then(unsignedXDR => {
                    const transaction = new Stellar.Transaction(unsignedXDR);
                    transaction.sign(Keypair.fromSecret(account.signature.secret));
                    return transaction
                        .toEnvelope()
                        .toXDR()
                        .toString('base64');
                });
                signer.requestXDR = undefined;
                return await afterfunction(signedXDR);
            },
        };

        return signer;
    }
}
