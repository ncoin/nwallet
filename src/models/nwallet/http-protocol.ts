import { GetRequestBase, PutRequestBase, NoQuery, HttpRequestBase } from './http-protocol-base';
import { NWAsset, NWTransaction } from '../nwallet';

export interface HttpProtocolDecorator {
    url: () => string;
}

function HttpProtocol<T extends { new (...args: any[]): HttpRequestBase }>(prototype: T) {
    return prototype;
}

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

export class GetWalletRequest extends GetRequestBase<NoQuery, NWAsset.Data[]> {
    // todo decorator
    public url = () => Paths.get.wallets(this.credential.userId);
}

export class GetWalletDetailRequest extends GetRequestBase<NoQuery, number> {
    constructor(protected credential: { userId: string; userWalletId: number }) {
        super(credential);
    }
    public url = () => Paths.get.walletDetail(this.credential.userId, this.credential.userWalletId);
}

export class GetWalletTransactionsRequest extends GetRequestBase<{ offset: number; limit: number }, NWTransaction.Data[]> {
    constructor(protected credential: { userId: string; userWalletId: number }) {
        super(credential);
    }
    public url = () => Paths.get.walletTransactions(this.credential.userId, this.credential.userWalletId);
}

export class CreateWallet extends PutRequestBase<{
    currency_manage_id: string;
}> {
    public url = () => Paths.post.createWallet(this.credential.userId);
}

export class SetConfigurationRequest extends PutRequestBase<{
    device_id: string;
    is_push_notification: boolean;
}> {
    public url = () => Paths.put.configuraton(this.credential.userId);
}

export class GetCreationAvailableWallets extends GetRequestBase<NoQuery, {}> {
    public url: () => string;
}
