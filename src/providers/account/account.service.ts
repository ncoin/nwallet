import { LoggerService } from '../common/logger/logger.service';
import { Events } from 'ionic-angular';
import { NWallet } from '../../interfaces/nwallet';
import { Injectable } from '@angular/core';
import { PreferenceProvider, Preference } from '../common/preference/preference';
import { Keypair } from 'stellar-sdk';
import { NWAccount } from '../../models/nwallet';

@Injectable()
export class AccountService {
    public account_new: NWAccount.Account;
    // todo remove me--sky`
    public account: NWallet.Account;

    constructor(private event: Events, private preference: PreferenceProvider, private logger: LoggerService) {
        this.init();
    }

    private async init(): Promise<void> {
        this.account_new = new NWAccount.Account();
        this.account = await this.preference.get(Preference.Nwallet.walletAccount);
    }

    // todo remove me --sky`
    public async setAccount(account: NWallet.Account): Promise<NWallet.Account> {
        await this.preference.set(Preference.Nwallet.walletAccount, account);
        this.account = account;
        return this.account;
    }

    // todo remove me --sky`
    public async getAccount(): Promise<NWallet.Account> {
        if (!this.account) {
            this.account = await this.preference.get(Preference.Nwallet.walletAccount);
        }
        return this.account;
    }

    public getId(): string {
        return this.account.signature.public;
    }

    // todo decoration --sky`
    private checkAccount(): void {
        if (!this.account) {
            throw new Error('[account] account not exist!');
        }
    }

    public getNativeWallet(): NWallet.AssetContext {
        this.checkAccount();

        return this.account.wallets.find(wallet => {
            return wallet.item.asset.isNative() === true;
        });
    }

    public getNativeAssets(): NWallet.AssetContext[] {
        this.checkAccount();

        return this.account.wallets.filter(wallet => {
            return wallet.item.isNative;
        });
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
            secret: keyPair.secret()
        };
    }

    public flush(): void {
        this.account = undefined;
    }
}
