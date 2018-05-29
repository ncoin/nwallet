import { ConnectProvider } from './../nsus/connector';
import { Injectable } from '@angular/core';
import {
    PreferenceProvider,
    Preference,
} from '../common/preference/preference';
import { App } from 'ionic-angular';
import { Logger } from '../common/logger/logger';
import { NWallet } from '../../interfaces/nwallet';
// import { TutorialPage } from '../../pages/tutorial/tutorial';

/**
 * common config provider
 */
@Injectable()
export class AppServiceProvider {
    constructor(
        private preference: PreferenceProvider,
        private app: App,
        private logger: Logger,
        private connector: ConnectProvider
    ) {
        console.log(app.getRootNav());
    }

    public async walkThrough(processFunc: () => void): Promise<void> {
        Preference.App.hasSeenTutorial;
        this.preference;
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
    }

    public async logout(account: NWallet.Account): Promise<void> {
        await this.preference.remove(Preference.Nwallet.walletAccount);
        await this.connector.unSubscribe(account);
        this.logger.debug('logout', account.signature.public);
    }

    public async sendPayment(signature: NWallet.Signature, destination: string, wallet: NWallet.WalletItem, amount: string): Promise<void> {
        this.connector.sendPayment(signature, destination, wallet, amount);
    }
}
