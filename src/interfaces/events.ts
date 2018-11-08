import { WalletProtocol } from '../providers/nsus/notification.service';
import { Ticker } from '../models/nwallet/protocol/ticker';
import { GetWalletTransactions } from '../models/nwallet/protocol';

export class EventParameter<T> {
    constructor(private name: string) {}
    public get key(): string {
        return this.name;
    }

    static create<T>(value: string): EventParameter<T> {
        return new EventParameter<T>(value);
    }
}

export const NWEvent = {
    App: {
        initialize: EventParameter.create('app-initialize'),
        user_login: EventParameter.create<{ userName: string }>('app-user_login'),
        user_logout: EventParameter.create('app-user_logout'),
        change_tab: EventParameter.create<{ index: number; currencyId: number }>('app-change_tab'),
        error_occured: EventParameter.create<{ reason: string }>('error_occured'),
    },

    NWallet: {},

    Stream: {
        ticker: EventParameter.create<Ticker>('stream-ticker'),
        wallet: EventParameter.create<WalletProtocol[]>('stream-wallet')
    },

    Protocol: {
        change_tab: EventParameter.create<GetWalletTransactions>('app-change_tab')
    }
};
