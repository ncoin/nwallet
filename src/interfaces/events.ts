import { NWallet } from './nwallet';

export class Events<T> {
    lintVoid: T;
    constructor(private name: string) {
        this.lintVoid = undefined;
    }
    getKey(): string {
        return this.name;
    }
}

export const EventTypes = {
    App: {
        user_login: set<string>('user_login'),
        user_logout: set<string>('user_logout'),
    },

    NWallet: {
        account_create: new Events<string>('account_create'),
        account_import: set<string>('account_import'),
        account_refresh_wallet: set<NWallet.WalletContext[]>('account_refresh_wallet'),
    },
};

function set<T>(value: string): Events<T> {
    return new Events<T>(value);
}
