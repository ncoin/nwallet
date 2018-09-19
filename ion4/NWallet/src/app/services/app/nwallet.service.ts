import { EventService } from '../cores/event/event.service';
import { AccountService } from './account/account.service';
import { NWalletClientService } from '../domain/nsus/nwallet-client.service';
import { Injectable } from '@angular/core';
import { PreferenceService, Preference } from '../cores/preference/preference.service';
import { App } from '@ionic/angular';
import { LoggerService } from '../cores/logger/logger.service';
import { NWallet } from '../../interfaces/nwallet';
import { Asset } from 'stellar-sdk';
import { EventTypes } from '../../interfaces/events';

/**
 * common business logic provider
 */
@Injectable()
export class NWalletService {
    constructor(
        private preference: PreferenceService,
        private app: App,
        private logger: LoggerService,
        private connector: NWalletClientService,
        private account: AccountService,
        private event: EventService
    ) {}

    public async flushApplication(): Promise<void> {
        await this.preference.clear();
    }

    public async tutorialRead(): Promise<void> {
        await this.preference.set(Preference.App.hasSeenTutorial, true);
    }

    // todo fixme
    public async login(account: NWallet.Account): Promise<void> {
        await this.account.setAccount(account);
        await this.connector.fetchJobs(account);
        this.logger.debug('[app-service] login done');
        this.event.publish(EventTypes.App.user_login);
    }

    public async logout(): Promise<void> {
        if (!this.account.account) {
            throw new Error('[app-service] invalid logout operation. account not exists');
        }

        this.logger.debug('logout', this.account.account.signature.public);
        await this.preference.remove(Preference.Nwallet.walletAccount);

        // todo unsubscribe
        await this.connector.unSubscribes(this.account.account);
        this.account.flush();
        this.event.publish(EventTypes.App.user_logout);
    }

    public async getTransfer(skip: number = 0): Promise<NWallet.Protocol.Transaction[]> {
        const account = await this.account.getAccount();
        const response = await this.connector.getTransfers(account.signature.public, expr => {
            expr.limit = '20';
            // expr.order = 'desc';
            // e.asset_code = asset.getCode();
            expr.skip = skip.toString();
        });

        return response ? response.transactions : [];
    }

    public async getCollaterals() {
        const response = await this.connector.getCollaterals();
        return response ? response : [];
    }
    public async getCurrentLoanStatus() {
        const response = await this.connector.getCurrentLoanStatus(this.account.getId());
        return response ? response.loans : [];
    }

    public async getLoanHistories() {}

    public async getTransactions(asset: Asset, pageToken?: string) {
        return await this.connector.getTransactions(this.account.getId(), asset, pageToken);
    }
}
