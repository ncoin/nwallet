import { Events, App } from 'ionic-angular';
import { NWallet } from './../../interfaces/nwallet';
import { Injectable } from "@angular/core";
import { PreferenceProvider, Preference } from '../common/preference/preference';

@Injectable()
export class AccountProvider {

    private account: NWallet.Account;

    constructor(private event: Events, private preference: PreferenceProvider){
        this.init();
    }

    private async init(): Promise<void> {
        this.account = await this.preference.get(Preference.Nwallet.walletAccount);
    }

    public async getAccount(): Promise<NWallet.Account> {
        return this.account;
    }
}
