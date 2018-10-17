import { TickerProtocol, WalletProtocol } from '../providers/nsus/notification';

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
        user_login: EventParameter.create('app-user_login'),
        user_logout: EventParameter.create('app-user_logout')
    },

    NWallet: {
    },

    Stream: {
        ticker: EventParameter.create<TickerProtocol>('stream-ticker'),
        wallet: EventParameter.create<WalletProtocol>('stream-wallet')
    }
};

