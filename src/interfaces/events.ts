import { TickerProtocol, WalletProtocol } from '../providers/nsus/notification';

export class EventType<T> {
    constructor(private name: string) {}
    public get key(): string {
        return this.name;
    }

    static create<T>(value: string): EventType<T> {
        return new EventType<T>(value);
    }
}

export const NWEvent = {
    App: {
        user_login: EventType.create('app-user_login'),
        user_logout: EventType.create('app-user_logout')
    },

    NWallet: {
        account_create: EventType.create('wallet-account_create'),
        account_import: EventType.create('wallet-account_import'),
        account_refresh_wallet: EventType.create('wallet-account_refresh_wallet')
    },

    Stream: {
        ticker: EventType.create<TickerProtocol>('stream-ticker'),
        wallet: EventType.create<WalletProtocol>('stream-wallet')
    }
};

