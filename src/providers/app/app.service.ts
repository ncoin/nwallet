import { AccountProvider } from './../account/account';
import { NClientProvider } from './../nsus/nclient';
import { Injectable } from '@angular/core';
import { PreferenceProvider, Preference } from '../common/preference/preference';
import { App } from 'ionic-angular';
import { Logger } from '../common/logger/logger';
import { NWallet } from '../../interfaces/nwallet';
import { Asset } from 'stellar-sdk';
// import { TutorialPage } from '../../pages/tutorial/tutorial';

/**
 * common config provider
 */
@Injectable()
export class AppServiceProvider {
    constructor(private preference: PreferenceProvider, private app: App, private logger: Logger, private connector: NClientProvider, private account: AccountProvider) {}

    public async walkThrough(processFunc: () => void): Promise<void> {
        this.app;
        processFunc();
    }

    public async flushApplication(): Promise<void> {
        await this.preference.clear();
    }

    public async tutorialRead(): Promise<void> {
        await this.preference.set(Preference.App.hasSeenTutorial, true);
    }

    public async login(account: NWallet.Account): Promise<void> {
        await this.connector.fetchJobs(account);
        await this.connector.createTokenTrust(account);
    }

    public async logout(account: NWallet.Account): Promise<void> {
        await this.preference.remove(Preference.Nwallet.walletAccount);
        await this.connector.unSubscribe(account);
        this.account.flush();
        this.logger.debug('logout', account.signature.public);
    }

    public async sendPayment(signature: NWallet.Signature, destination: string, asset: Asset, amount: string): Promise<void> {
        this.connector.sendPayment(signature, destination, asset, amount);
    }

    public async getTransactions(signature: NWallet.Signature){
        const record = await this.connector.getTransaction(signature);
        if (record) {
            const transaction = {
                current : record,
                records : () => {
                    return record.records;
                },
                next : async () => {
                    transaction.current = await record.next();
                }
            }
            return transaction;
        }
    }

    public async requestLoan(amount: number, wallet:NWallet.WalletItem): Promise<void> {
        const account = await this.account.getAccount();
        await this.connector.loanNCH(account.signature, amount, wallet);
    }

    public async requestBuy(amount: number, wallet:NWallet.WalletItem): Promise<void> {
        const account = await this.account.getAccount();
        await this.connector.buyNCH(account.signature, amount, wallet);
    }
}
