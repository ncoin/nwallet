import { LoggerService } from '../common/logger/logger.service';
import { Injectable } from '@angular/core';
import { PreferenceProvider, Preference } from '../common/preference/preference';
import { NWAccount, NWAsset } from '../../models/nwallet';
import { PromiseWaiter } from 'forge/dist/helpers/Promise/PromiseWaiter';
import { Debug } from '../../utils/helper/debug';

@Injectable()
export class AccountService {
    private task: PromiseWaiter<NWAccount.Account>;
    private account: NWAccount.Account;

    constructor(private preference: PreferenceProvider, private logger: LoggerService) {
        this.init();
    }

    private async init(): Promise<void> {
        this.task = new PromiseWaiter<NWAccount.Account>();
        this.account = new NWAccount.Account();
        const accountData = await this.preference.get(Preference.Nwallet.account);
        if (accountData) {
            this.account.initialize(accountData);
        }

        this.task.trySet(this.account);
    }

    public async detail(): Promise<NWAccount.Account> {
        return await this.task.result();
    }

    public async isSaved(): Promise<boolean> {
        const account = await this.preference.get(Preference.Nwallet.account);
        return account !== undefined;
    }

    public fillData(expr: (personal: NWAccount.Personal) => void): void {
        Debug.Assert(this.account);
        expr(this.account.personal);
    }

    public async flush(): Promise<void> {
        await this.preference.remove(Preference.Nwallet.account);
        this.account.flush();
        this.task = new PromiseWaiter<NWAccount.Account>();
    }
}
