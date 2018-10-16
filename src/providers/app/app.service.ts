import { EventProvider } from '../common/event/event';
import { AccountService } from '../account/account.service';
import { NClientProvider } from '../nsus/nclient';
import { Injectable } from '@angular/core';
import { PreferenceProvider, Preference } from '../common/preference/preference';
import { App } from 'ionic-angular';
import { LoggerService } from '../common/logger/logger.service';
import { NWallet } from '../../interfaces/nwallet';
import { NWEvent } from '../../interfaces/events';
import { NsusChannelService } from '../nsus/nsus-channel.service';

/** todo change me --sky */
import { PromiseWaiter } from 'forge/dist/helpers/Promise/PromiseWaiter';
import { NWAccount } from '../../models/nwallet';
import { BehaviorSubject } from 'rxjs';

/**
 * common business logic provider
 */

interface AccountCallback {
    onInventory: BehaviorSubject<NWAccount.Inventory>;
}

@Injectable()
export class NWalletAppService {

    constructor(
        private preference: PreferenceProvider,
        private channel: NsusChannelService,
        private app: App,
        private logger: LoggerService,
        private account: AccountService,
        private event: EventProvider
    ) {
        this.fetchJobs = new PromiseWaiter<boolean>();

        this.subjects = {
            onInventory: new BehaviorSubject<NWAccount.Inventory>(this.account.account_new.inventory)// todo change me
        };
    }
    private fetchJobs: PromiseWaiter<boolean>;
    private subjects: AccountCallback;

    // load or fetch
    private async;

    public onAccount = (onAccount: (account: AccountCallback) => void): void => {
        onAccount(this.subjects);
    }

    public waitFetch(): Promise<boolean> {
        return this.fetchJobs.result();
    }

    public async flushApplication(): Promise<void> {
        await this.preference.clear();
    }

    public async tutorialRead(): Promise<void> {
        await this.preference.set(Preference.App.hasSeenTutorial, true);
    }

    // todo fixme
    public async login(account: NWallet.Account): Promise<void> {
        await this.account.setAccount(account);

        const result = await Promise.all([this.channel.getAssets()]);

        this.fetchJobs.set(true);

        this.logger.debug('[app-service] login done');
        this.event.publish(NWEvent.App.user_login);
    }

    public async logout(): Promise<void> {
        if (!this.account.account) {
            throw new Error('[app-service] invalid logout operation. account not exists');
        }

        this.logger.debug('logout', this.account.account.signature.public);
        await this.preference.remove(Preference.Nwallet.walletAccount);

        // todo unsubscribe
        this.account.flush();
        this.event.publish(NWEvent.App.user_logout);
    }

    public async getTransfer(skip: number = 0): Promise<NWallet.Protocol.Transaction[]> {
        const account = await this.account.getAccount();
        return [];
        // const response = await this.connector.getTransfers(account.signature.public, expr => {
        //     expr.limit = '20';
        //     // expr.order = 'desc';
        //     // e.asset_code = asset.getCode();
        //     expr.skip = skip.toString();
        // });

        // return response ? response.transactions : [];
    }

    public async getCollaterals() {
        return [];
        // const response = await this.connector.getCollaterals();
        // return response ? response : [];
    }
    public async getCurrentLoanStatus() {
        return [];

        // const response = await this.connector.getCurrentLoanStatus(this.account.getId());
        // return response ? response.loans : [];
    }

    public async getLoanHistories() {}
}
