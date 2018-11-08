import { EventService } from '../common/event/event';
import { AccountService } from '../account/account.service';
import { Injectable } from '@angular/core';
import { PreferenceProvider, Preference } from '../common/preference/preference';
import { LoggerService } from '../common/logger/logger.service';
import { NWEvent } from '../../interfaces/events';
import { NsusChannelService } from '../nsus/nsus-channel.service';

/** todo change me --sky */
import { PromiseWaiter } from 'forge/dist/helpers/Promise/PromiseWaiter';
import { AppConfigService } from './app.config.service';

/**
 * common business logic provider
 */

@Injectable()
export class NWalletAppService {
    private fetchJobs: PromiseWaiter<boolean>;

    constructor(
        private preference: PreferenceProvider,
        private channel: NsusChannelService,
        private logger: LoggerService,
        private account: AccountService,
        private event: EventService
    ) {
        this.init();
    }

    // load or fetch
    private async init(): Promise<void> {
        this.fetchJobs = new PromiseWaiter<boolean>();
    }

    /**
     *
     *
     * @returns {Promise<string>} userName
     * @memberof NWalletAppService
     */
    public async canLogin(): Promise<string> {
        if (this.account.isSaved()) {
            this.logger.debug('[app] account already exist.');
            const account = await this.account.detail();
            return account.getUserName();
        } else {
            this.logger.debug('[app] account not exist.');
            return undefined;
        }
    }

    public async enter(userName: string): Promise<void> {
        this.account.setAccount(userName);
        const detail = await this.account.detail();

        this.event.publish(NWEvent.App.user_login, { userName: detail.getUserName() });
        await this.beginFetch();
    }

    public waitFetch(): Promise<boolean> {
        return this.fetchJobs.result();
    }

    public async beginFetch(): Promise<void> {
        // todo init token

        this.logger.debug('[app] begin fetch start');
        await Promise.all([this.account.fetchJobs()]);
        this.logger.debug('[app] begin fetch done');

        this.fetchJobs.set(true);
    }

    // todo fixme

    public async logout(): Promise<void> {
        // todo unsubscribe
        this.init();
        this.account.flush();
        this.event.publish(NWEvent.App.user_logout);
    }

    public async flushApplication(): Promise<void> {
        await this.preference.clear();
    }

    public async tutorialRead(): Promise<void> {
        await this.preference.set(Preference.App.hasSeenTutorial, true);
    }
}
