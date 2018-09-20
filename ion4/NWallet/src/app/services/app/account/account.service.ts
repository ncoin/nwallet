import { Injectable } from '@angular/core';
import { LoggerService } from '$services/cores/logger/logger.service';
import { PreferenceService, Preference } from '$services/cores/preference/preference.service';
import { Events } from 'ionic-angular';
import { NWallet } from '$infrastructure/nwallet';

@Injectable()
export class AccountService {
    public account: NWallet.Account;

    constructor(private event: Events, private preference: PreferenceService, private logger: LoggerService) {
        this.init();
    }

    private async init(): Promise<void> {
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

    public flush(): void {
        this.account = undefined;
    }
}
