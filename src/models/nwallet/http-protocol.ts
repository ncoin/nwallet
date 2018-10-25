import { GetRequestBase, PutRequestBase, NoQuery, HttpRequestBase } from './http-protocol-base';
import { NWAsset } from '../nwallet';

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
        creationAvailableWallets: (userId: string) => `users/${userId}/wallets/available`,
        ticker: (userId: string) => `users/${userId}/tickers`
    },

    post: {
        createWallet: (userId: string) => `/users/${userId}/wallets`
    },

    put: {
        configuraton: (userId: string) => `users/${userId}/cofiguration/push`
    }
};

export class GetWalletRequest extends GetRequestBase<NoQuery, NWAsset.Data[]> {
    // todo decorator
    public url = () => Paths.get.wallets(this.credential.userId);
}

export class GetWalletTransactionRequest extends GetRequestBase<{ offset: number; limit: number }, number> {
    constructor(protected credential: { userId: string; userWalletId: number }) {
        super(credential);
    }
    public url = () => Paths.get.walletDetail(this.credential.userId, this.credential.userWalletId);
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

