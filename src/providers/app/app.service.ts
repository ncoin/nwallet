import { EventProvider } from '../common/event/event';
import { AccountProvider } from '../account/account';
import { NClientProvider } from '../nsus/nclient';
import { Injectable } from '@angular/core';
import { PreferenceProvider, Preference } from '../common/preference/preference';
import { App } from 'ionic-angular';
import { Logger } from '../common/logger/logger';
import { NWallet } from '../../interfaces/nwallet';
import Stellar, { Asset, Keypair } from 'stellar-sdk';
import { EventTypes } from '../../interfaces/events';

/**
 * common business logic provider
 */
@Injectable()
export class AppServiceProvider {
    constructor(
        private preference: PreferenceProvider,
        private app: App,
        private logger: Logger,
        private connector: NClientProvider,
        private account: AccountProvider,
        private event: EventProvider,
    ) {
        this.app;

        this.preference.remove(Preference.Nwallet.walletAccount);
    }

    public async flushApplication(): Promise<void> {
        await this.preference.clear();
    }

    public async tutorialRead(): Promise<void> {
        await this.preference.set(Preference.App.hasSeenTutorial, true);
    }

    //todo fixme
    public async login(account: NWallet.Account): Promise<void> {
        await this.account.setAccount(account);
        await this.connector.fetchJobs(account);
        this.requestTrust();
        this.logger.debug('[appService] login done');
        this.event.publish(EventTypes.App.user_login);
    }

    public async logout(account: NWallet.Account): Promise<void> {
        await this.preference.remove(Preference.Nwallet.walletAccount);
        //todo unsubscribe
        await this.connector.unSubscribes(account);
        this.account.flush();
        this.logger.debug('logout', account.signature.public);
        this.event.publish(EventTypes.App.user_logout);
    }

    public async getTransactions(asset: Asset, pageToken?: string) {
        //todo fixme
        const account = await this.account.getAccount();
        return await this.connector.getTransactions(account.signature.public, asset, pageToken);
    }

    private async requestTrust(): Promise<void> {
        this.processXdr(NWallet.Protocol.XdrRequestTypes.Trust, {});
    }

    public async requestBuy(asset: Asset, amount: number): Promise<void> {
        await this.processXdr(NWallet.Protocol.XdrRequestTypes.Buy, {
            amount: amount,
            asset_code: asset.getCode(),
        });
    }

    public async requestLoan(asset: Asset, amount: number): Promise<void> {
        await this.processXdr(NWallet.Protocol.XdrRequestTypes.Loan, {
            amount: amount,
            asset_code: asset.getCode(),
        });
    }

    private async processXdr(requestType: NWallet.Protocol.XdrRequestTypes, params: Object): Promise<void> {
        const account = await this.account.getAccount();
        params['public_key'] = account.signature.public;
        const xdrResponse = await this.connector.requestXDR(requestType, params);

        if (xdrResponse) {
            const transaction = new Stellar.Transaction(xdrResponse.xdr);
            transaction.sign(Keypair.fromSecret(account.signature.secret));
            await this.connector.executeXDR(requestType, {
                public_key: account.signature.public,
                id: xdrResponse.id.toString(),
                xdr: transaction
                    .toEnvelope()
                    .toXDR()
                    .toString('base64'),
            });
        }
    }
}
