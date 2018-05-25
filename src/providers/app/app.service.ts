import { Injectable } from '@angular/core';
import { PreferenceProvider, Preference } from '../common/preference/preference';
import { NavController, App, Events } from 'ionic-angular';
import { EntrancePage } from '../../pages/0.entrance/entrance';
import { TutorialPage } from '../../pages/tutorial/tutorial';
import { Logger } from '../common/logger/logger';
// import { TutorialPage } from '../../pages/tutorial/tutorial';

/**
 * common config provider
 */
@Injectable()
export class AppServiceProvider {
    constructor(private preference: PreferenceProvider, private app:App, private logger: Logger, private event:Events) {
        console.log(app.getRootNav());
    }
    private get nav(): NavController {
        return this.app.getRootNav();
    }

    public async walkThrough(processFunc: () => void): Promise<void> {
        Preference.App.hasSeenTutorial;
        this.preference;
        this.app;
        processFunc();
        EntrancePage;
        TutorialPage;
    }

    public async login(): Promise<void> {
        const account = await this.preference.get(Preference.Nwallet.walletAccount);
        if (account) {
            this.event.publish('login', account);
        } else{
            this.logger.error('invalid nwallet account', account);
        }
    }

    public async logout(): Promise<void> {
        await this.preference.remove(Preference.Nwallet.walletAccount);
    }
}
