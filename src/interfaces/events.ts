import { GetWalletTransactions } from '../models/api/nwallet';
import { StreamType, TickerStreamData, WalletStreamData } from './stream';
import { Debug } from '../utils/helper/debug';
import { ResultCode } from './error';

export class EventParameter<T> {
    static dic: Map<string, EventParameter<any>> = new Map<string, EventParameter<any>>();
    constructor(private name: string) {}
    public get key(): string {
        return this.name;
    }

    static create<T>(value: string): EventParameter<T> {
        Debug.assert(!EventParameter.dic.has(value));
        const event = new EventParameter<T>(value);
        EventParameter.dic.set(event.key, event);
        return event;
    }

    static from(value: string): EventParameter<any> {
        return EventParameter.dic.get(value);
    }
}

export const NWEvent = {
    App: {
        initialize: EventParameter.create('app-initialize'),
        user_login: EventParameter.create<{ userName: string }>('app-user_login'),
        user_logout: EventParameter.create('app-user_logout'),
        change_tab: EventParameter.create<{ index: number; currencyId: number }>('app-change_tab'),
        error_occured: EventParameter.create<{ reason: ResultCode }>('error_occured')
    },

    NWallet: {},

    Stream: {
        ticker: EventParameter.create<TickerStreamData>(StreamType.Ticker),
        wallet: EventParameter.create<WalletStreamData[]>(StreamType.Wallet)
    },

    Protocol: {
        change_tab: EventParameter.create<GetWalletTransactions>('protocol-change_tab')
    }
};
