import { LoggerService } from '../common/logger/logger.service';
import { Injectable } from '@angular/core';
import { PreferenceProvider, Preference } from '../common/preference/preference';
import { NWAccount, NWAsset, NWTransaction } from '../../models/nwallet';
import { PromiseWaiter } from 'forge/dist/helpers/Promise/PromiseWaiter';
import { Debug } from '../../utils/helper/debug';
import { BehaviorSubject, Subscription, Subject } from 'rxjs';
import { ParameterExpr } from 'forge';
import { EventService } from '../common/event/event';
import { NWEvent } from '../../interfaces/events';
import { NsusChannelService } from '../nsus/nsus-channel.service';

interface AccountStream {
    assetChanged: (func: (asset: NWAsset.Item[]) => void) => Subscription;
    assetTransactionsChanged: (walletId: number, func: (asset: NWTransaction.Item[]) => void) => Subscription;
}

@Injectable()
export class AccountService {
    private task: PromiseWaiter<NWAccount.Account>;
    private account: NWAccount.Account;
    private streams: AccountStream;

    constructor(private preference: PreferenceProvider, private logger: LoggerService, private event: EventService, private channel: NsusChannelService) {
        this.account = new NWAccount.Account();
        this.task = new PromiseWaiter<NWAccount.Account>();

        this.streams = {
            assetChanged: assets => this.account.inventory.getAssetItems().subscribe(assets), // todo change me
            assetTransactionsChanged: (walletId, walletFunc) => this.account.inventory.getTransaction(walletId).subscribe(walletFunc)
        };

        // todo get wallet strategy

        this.init();
    }

    public getTrasaction(walletId: number): Subject<NWTransaction.Item[]> {

        this.channel.getAssetTransactions(walletId).then(assets => {

        })

        return this.account.inventory.getTransaction(walletId);
    }

    private async init(): Promise<void> {
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

    public text() {
        this.logger.debug('[account] on refresh');
        this.account.inventory.refresh();
    }

    public registerSubjects = (onAccount: (account: AccountStream) => void): void => {
        onAccount(this.streams);
    };

    public fillData(expr: (personal: NWAccount.Personal) => void): void {
        Debug.assert(this.account);
        expr(this.account.personal);
    }

    public async flush(): Promise<void> {
        await this.preference.remove(Preference.Nwallet.account);
        this.account.flush();
    }
}
