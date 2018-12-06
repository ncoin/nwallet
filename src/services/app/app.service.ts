import { EventService } from '../common/event/event.service';
import { AccountService } from '../account/account.service';
import { Injectable } from '@angular/core';
import { PreferenceService, Preference } from '../common/preference/preference.service';
import { LoggerService } from '../common/logger/logger.service';
import { NWEvent } from '../../interfaces/events';
import { ChannelService } from '../nwallet/channel.service';
import { PromiseCompletionSource } from '../../../common/models';
import { ErrorCode } from '../../interfaces/error';

@Injectable()
export class NWalletAppService {
    private fetchJobs: PromiseCompletionSource<boolean>;

    constructor(private preference: PreferenceService, private logger: LoggerService, private account: AccountService, private event: EventService) {
        this.fetchJobs = new PromiseCompletionSource<boolean>();

        this.event.subscribe(NWEvent.App.error_occured, async context => {
            if (context.reason === ErrorCode.UnAuth) {
                this.fetchJobs.trySetResult(false);
                this.logout();
            }
        });

        this.event.subscribe(NWEvent.App.user_login, async context => {
            this.fetchJobs.trySetResult(true);
            await this.beginFetch();
        });

        this.event.subscribe(NWEvent.App.user_logout, async () => {
            if (this.fetchJobs.isCompleted()) {
                this.fetchJobs = new PromiseCompletionSource<boolean>();
            }
            this.account.flush();
        });
    }

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
        this.event.publish(NWEvent.App.user_login, { userName: userName });
    }

    private async beginFetch(): Promise<void> {
        this.logger.debug('[app] begin fetch start');
        await Promise.all([this.account.fetchJobs()]);
        this.logger.debug('[app] begin fetch done');
    }

    public waitFetch(): Promise<boolean> {
        return this.fetchJobs.getResultAsync();
    }

    public async logout(): Promise<void> {
        this.event.publish(NWEvent.App.user_logout);
    }

    public async flushApplication(): Promise<void> {
        await this.preference.clear();
    }

    public async tutorialRead(): Promise<void> {
        await this.preference.set(Preference.App.hasSeenTutorial, true);
    }
}
