import { GetProtocolBase, PutProtocolBase, NoQuery, HttpProtocolBase, NoResponse } from './http-protocol-base';
import { NWAsset, NWTransaction } from '../nwallet';

export interface HttpProtocolDecorator {
    url: () => string;
}

// function HttpProtocol<T extends { new (...args: any[]): HttpRequestBase }>(prototype: T) {
//     return prototype;
// }

// todo rework --sky
export const Paths = {
    get: {
        wallets: (userId: string) => `users/${userId}/wallets`,
        walletDetail: (userId: string, userWalletId: number) => `users/${userId}/wallets/${userWalletId}`,
        walletTransactions: (userId: string, userWalletId: number) => `users/${userId}/wallets/${userWalletId}/transactions`,
        creationAvailableWallets: (userId: string) => `users/${userId}/wallets/available`,
        ticker: (userId: string) => `users/${userId}/tickers`,
        sendAssetFee: (userId: string, userWalletId: number) => `users/${userId}/wallets/${userWalletId}/send/fee`
    },

    post: {
        createWallet: (userId: string) => `/users/${userId}/wallets`,
        sendAsset: (userId: string, userWalletId: number) => `users/${userId}/wallets/${userWalletId}/send`
    },

    put: {
        configuraton: (userId: string) => `users/${userId}/cofiguration/push`,
        walletAlign: (userId: string) => `users/${userId}/wallets/align`
    }
};

export class GetWalletProtocol extends GetProtocolBase<NoQuery, NWAsset.Data[]> {
    // todo decorator
    public url = () => Paths.get.wallets(this.credential.userId);
}

export class GetWalletDetailProtocol extends GetProtocolBase<NoQuery, number> {
    constructor(protected credential: { userId: string; userWalletId: number }) {
        super(credential);
    }
    public url = () => Paths.get.walletDetail(this.credential.userId, this.credential.userWalletId);
}

export class GetWalletTransactionsProtocol extends GetProtocolBase<{ offset: number; limit: number }, NWTransaction.Data[]> {
    constructor(protected credential: { userId: string; userWalletId: number }) {
        super(credential);
    }
    public url = () => Paths.get.walletTransactions(this.credential.userId, this.credential.userWalletId);
}

export class CreateWalletProtocol extends PutProtocolBase<
    {
        currency_manage_id: string;
    },
    NoResponse
> {
    public url = () => Paths.post.createWallet(this.credential.userId);
}

export class SetConfigurationProtocol extends PutProtocolBase<
    {
        device_id: string;
        is_push_notification: boolean;
    },
    NoResponse
> {
    public url = () => Paths.put.configuraton(this.credential.userId);
}

export class GetCreationAvailableWalletsProtocol extends GetProtocolBase<NoQuery, {}> {
    public url: () => string;
}
