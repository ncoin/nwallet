import { EventService } from '../common/event/event';
import { AccountService } from '../account/account.service';
import { Injectable } from '@angular/core';
import { PreferenceProvider, Preference } from '../common/preference/preference';
import { LoggerService } from '../common/logger/logger.service';
import { NWEvent } from '../../interfaces/events';
import { NsusChannelService } from '../nsus/nsus-channel.service';

/** todo change me --sky */
import { PromiseWaiter } from 'forge/dist/helpers/Promise/PromiseWaiter';

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

        this.event.subscribe(NWEvent.App.error_occured, async context => {
            if (context.reason === 'unauth') {
                await this.waitFetch();
                this.logout();
            }
        });
    }

    // load or fetch
    private init(): void {
        this.fetchJobs = new PromiseWaiter<boolean>();
    }

    /**
     *
     *
     * @returns {Promise<string>} userName
     * @memberof NWalletAppService
     */
    public async canLogin(): Promise<string> {
        if (await this.account.isSaved()) {
            this.account.isSaved();
            const account = await this.account.detail();
            this.logger.debug('[app] account already exist. : ', account.getUserName());
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

    public async beginFetch(): Promise<void> {
        this.logger.debug('[app] begin fetch start');
        await Promise.all([this.account.fetchJobs()]);
        this.logger.debug('[app] begin fetch done');
        this.fetchJobs.set(true);
    }

    public waitFetch(): Promise<boolean> {
        return this.fetchJobs.result();
    }

    public async logout(): Promise<void> {
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
