import { LoggerService } from '../common/logger/logger.service';
import { Injectable } from '@angular/core';
import { PreferenceProvider, Preference } from '../common/preference/preference';
import { NWAccount, NWProtocol } from '../../models/nwallet';
import { PromiseWaiter } from 'forge/dist/helpers/Promise/PromiseWaiter';
import { Debug } from '../../utils/helper/debug';
import { EventService } from '../common/event/event';
import { NWEvent } from '../../interfaces/events';
import { NsusChannelService } from '../nsus/nsus-channel.service';
import { AccountSubject, AccountCallbackImpl } from './account.service.callback';

@Injectable()
export class AccountService {
    private task: PromiseWaiter<NWAccount.Account>;
    private account: NWAccount.Account;
    private streams: AccountSubject;

    constructor(private preference: PreferenceProvider, private logger: LoggerService, private event: EventService, private channel: NsusChannelService) {
        this.account = new NWAccount.Account();
        this.streams = new AccountCallbackImpl(this.account);
        this.task = new PromiseWaiter<NWAccount.Account>();

        this.init();
    }

    private async init(): Promise<void> {
        this.subscribes();

        const accountData = await this.preference.get(Preference.Nwallet.account);
        if (accountData) {
            this.account.initialize(accountData);
        }

        this.task.trySet(this.account);
    }

    public registerSubjects = (onAccount: (account: AccountSubject) => void): void => {
        onAccount(this.streams);
    }

    public async setAccount(userName: string): Promise<void> {
        this.account.setUserName(userName);
        await this.preference.set(Preference.Nwallet.account, this.account);
    }

    public async fetchJobs(): Promise<void> {
        this.refreshAssets();
    }

    private async refreshAssets() {
        const refreshes = await Promise.all([this.channel.fetchCurrencies(), this.channel.fetchTicker(), this.channel.getAssets()]);
        const currencies = refreshes[0];
        const assets = refreshes[2];
        const tickers = refreshes[1];

        // tickers.forEach(ticker => {
        //     this.event.publish(NWEvent.Stream.ticker, ticker);
        // });

        assets.forEach(asset => {
            const target = currencies.find(c => c.id === asset.getCurrencyId());
            if (target) {
                asset.setCurrency(target);
            }
        });

        this.account.inventory.setItems(assets);
        this.account.inventory.refresh();
    }

    public async detail(): Promise<NWAccount.Account> {
        return await this.task.result();
    }

    public async isSaved(): Promise<boolean> {
        const detail = await this.detail();
        return detail.getUserName() !== undefined && detail.getUserName() !== '';
    }

    public async flush(): Promise<void> {
        await this.preference.remove(Preference.Nwallet.account);
        this.account.flush();
    }

    private subscribes() {
        this.event.subscribe(NWEvent.Stream.wallet, async context => {
            context.forEach(wallet => {
                this.channel.getWalletTransactions(wallet.id, 0, 10);
                this.channel.getWalletDetails(wallet.id);
            });
        });

        this.event.subscribe(NWEvent.App.user_login, async context => {
            this.setAccount(context.userName);
        });

        this.channel.register(NWProtocol.SetWalletAlign, protocol => {
            const order = protocol.data;

            if (order.length < 1) {
                return;
            }

            const assets = this.account.inventory.getAssetItems().getValue();
            order.forEach((walletId, index) => {
                const targetAsset = assets.find(asset => asset.getWalletId() === walletId);
                Debug.assert(targetAsset);
                targetAsset.option.order = index;
            });

            this.account.inventory.refresh();
        });

        this.channel.register(NWProtocol.SetWalletVisibility, protocol => {
            const data = protocol.data;
            const item = this.account.inventory
                .getAssetItems()
                .getValue()
                .find(e => e.getWalletId() === data.walletId);
            if (item) {
                item.option.isShow = data.isVisible;
                this.account.inventory.refresh();
            }
        });

        this.channel.register(NWProtocol.CreateWallet, async () => {
            this.refreshAssets();
        });

        this.channel.register(NWProtocol.GetWalletTransactions, async protocol => {
            // todo fixme
            if (protocol.data && protocol.data.length > 0) {
                this.account.inventory.insertTransactions(protocol.credential.userWalletId, protocol.data);
            }
        });

        this.channel.register(NWProtocol.GetWalletDetail, async protocol => {
            const data = protocol.response;
            // todo later
            const copy = this.account.inventory
                .getAssetItems()
                .getValue()
                .slice();
            const target = copy.find(a => a.data.id === data.id);
            target.updateData(data);
            this.account.inventory.setItems(copy);
            this.account.inventory.refresh();
        });
    }
}
