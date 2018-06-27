import { Logger } from './../common/logger/logger';
import { Events } from 'ionic-angular';
import { NWallet } from './../../interfaces/nwallet';
import { Injectable } from '@angular/core';
import { PreferenceProvider, Preference } from '../common/preference/preference';
import { Keypair } from 'stellar-sdk';

@Injectable()
export class AccountProvider {
    public account: NWallet.Account;

    constructor(private event: Events, private preference: PreferenceProvider, private logger: Logger) {
        this.init();
    }

    private async init(): Promise<void> {
        this.event;

        this.account = await this.preference.get(Preference.Nwallet.walletAccount);
        this.logger.debug('account provider initiated');
    }

    public async getAccount(): Promise<NWallet.Account> {
        if (!this.account) {
            this.account = await this.preference.get(Preference.Nwallet.walletAccount);
        }
        return this.account;
    }

    public generateSignature(secretKey?: string): NWallet.Signature {
        let keyPair: Keypair;
        if (secretKey) {
            keyPair = Keypair.fromSecret(secretKey);
        } else {
            keyPair = Keypair.random();
        }

        return <NWallet.Signature>{
            public: keyPair.publicKey(),
            secret: keyPair.secret(),
        };
    }

    public flush(): void {
        this.account = undefined;
    }
}
