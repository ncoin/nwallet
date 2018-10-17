import { EventService } from '../common/event/event';
import { AccountService } from '../account/account.service';
import { Injectable } from '@angular/core';
import { PreferenceProvider, Preference } from '../common/preference/preference';
import { LoggerService } from '../common/logger/logger.service';
import { NWEvent } from '../../interfaces/events';
import { NsusChannelService } from '../nsus/nsus-channel.service';

/** todo change me --sky */
import { PromiseWaiter } from 'forge/dist/helpers/Promise/PromiseWaiter';
import { NWAccount } from '../../models/nwallet';
import { BehaviorSubject } from 'rxjs';

/**
 * common business logic provider
 */

interface AccountStream {
    onInventory: BehaviorSubject<NWAccount.Inventory>;
}

@Injectable()
export class NWalletAppService {
    private fetchJobs: PromiseWaiter<boolean>;
    private streams: AccountStream;

    constructor(
        private preference: PreferenceProvider,
        private channel: NsusChannelService,
        private logger: LoggerService,
        private account: AccountService,
        private event: EventService
    ) {}

    // load or fetch
    private async init(): Promise<void> {
        this.fetchJobs = new PromiseWaiter<boolean>();
        const account = await this.account.detail();
        this.streams = {
            onInventory: new BehaviorSubject<NWAccount.Inventory>(account.inventory) // todo change me
        };
    }

    public registerAccountStream = (onAccount: (account: AccountStream) => void): void => {
        onAccount(this.streams);
    }

    public waitFetch(): Promise<boolean> {
        return this.fetchJobs.result();
    }

    public async beginFetch(): Promise<void> {
        // todo init token
        this.event.publish(NWEvent.App.initialize);
        const result = await Promise.all([this.channel.fetchJobs()]);
        this.fetchJobs.set(true);
    }

    public async flushApplication(): Promise<void> {
        await this.preference.clear();
    }

    public async tutorialRead(): Promise<void> {
        await this.preference.set(Preference.App.hasSeenTutorial, true);
    }

    // todo fixme
    public async canLogin(): Promise<boolean> {
        if (this.account.isSaved()) {
            this.logger.debug('[app-service] try login success');
            return true;
        } else {
            this.logger.debug('[app-service] try login failed');
            return false;
        }
    }

    public async logIn(): Promise<void> {}

    public async logout(): Promise<void> {
        // todo unsubscribe
        this.account.flush();
        this.event.publish(NWEvent.App.user_logout);
    }

    public async getTransfer(skip: number = 0): Promise<any> {
        const account = await this.account.detail();
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
