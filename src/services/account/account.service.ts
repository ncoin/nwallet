import { LoggerService } from '../common/logger/logger.service';
import { Injectable } from '@angular/core';
import { PreferenceProvider, Preference } from '../common/preference/preference';
import { NWAccount, NWAsset, NWTransaction, NWProtocol } from '../../models/nwallet';
import { PromiseWaiter } from 'forge/dist/helpers/Promise/PromiseWaiter';
import { Debug } from '../../utils/helper/debug';
import { Subscription } from 'rxjs';
import { EventService } from '../common/event/event';
import { NWEvent } from '../../interfaces/events';
import { NsusChannelService } from '../nsus/nsus-channel.service';

interface AccountStream {
    assetChanged: (func: (asset: NWAsset.Item[]) => void) => Subscription;
    assetTransaction: (walletId: number, func: (asset: NWTransaction.Item[]) => void) => Subscription;
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
            assetTransaction: (walletId, walletFunc) => this.account.inventory.getTransaction(walletId).subscribe(walletFunc)
        };

        this.init();

        // todo
        this.event.subscribe(NWEvent.Stream.wallet, async context => {
            context.forEach(wallet => {
                this.getTransactions(wallet.id, 0, 10);
                this.channel.getWalletDetails(wallet.id);
            });
        });

        this.event.subscribe(NWEvent.App.user_login, async context => {
            const detail = await this.detail();
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
            const assets = await this.channel.getAssets();
            this.account.inventory.setItems(assets);
            this.account.inventory.refresh();
            this.channel.fetchTicker();
            const tickers = await this.channel.fetchTicker();
            tickers.forEach(ticker => {
                this.event.publish(NWEvent.Stream.ticker, ticker);
            });
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

    public async setAccount(userName: string): Promise<void> {
        this.account.setUserName(userName);
        await this.preference.set(Preference.Nwallet.account, this.account);
    }

    public async fetchJobs(): Promise<void> {
        const assets = await this.channel.getAssets();
        const tickers = await this.channel.fetchTicker();
        tickers.forEach(ticker => {
            this.event.publish(NWEvent.Stream.ticker, ticker);
        });

        this.account.inventory.setItems(assets);
    }

    public async getTransactions(walletId: number, offset: number, limit: number): Promise<NWTransaction.Item[]> {
        const transactions = await this.channel.getWalletTransactions(walletId, offset, limit);

        // todo fixme
        await this.channel.getWalletDetails(walletId);

        this.account.inventory.insertTransactions(walletId, transactions);
        return transactions;
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
        const detail = await this.detail();
        return detail.getUserName() !== undefined && detail.getUserName() !== '';
    }

    public registerSubjects = (onAccount: (account: AccountStream) => void): void => {
        onAccount(this.streams);
    }

    public fillData(expr: (personal: NWAccount.Personal) => void): void {
        Debug.assert(this.account);
        expr(this.account.personal);
    }

    public async flush(): Promise<void> {
        await this.preference.remove(Preference.Nwallet.account);
        this.account.flush();
    }
}
