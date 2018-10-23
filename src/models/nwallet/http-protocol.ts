import { GetRequestBase, PutRequestBase, NoParameter, HttpRequestBase } from './http-protocol-base';
import { NWAsset } from '../nwallet';
import { Debug } from '../../utils/helper/debug';
import { TypeDecorator, Type, Component } from '@angular/core';
import { analyzeAndValidateNgModules } from '@angular/compiler';

export interface HttpProtocolDecorator {
    url: () => string;
}

function HttpProtocol<T extends { new (...args: any[]): HttpRequestBase }>(prototype: T) {
    return prototype;
}

// todo rework --sky
const Paths = {
    get: {
        wallets: (user_id: string) => `users/${user_id}/wallets`,
        walletDetail: (user_id: string, user_wallet_id: string) => `users/${user_id}/wallets/${user_wallet_id}`,
        creationAvailableWallets: (user_id: string) => `users/${user_id}/wallets/available`
    },

    post: {
        createWallet: (user_id: string) => `/users/${user_id}/wallets`
    },

    put: {
        configuraton: (user_id: string) => `users/${user_id}/cofiguration/push`
    }
};

export class GetWalletRequest extends GetRequestBase<NoParameter, NWAsset.Data[]> {
    public url = () => Paths.get.wallets(this.credential.userId);
}

export class GetWalletDetailRequest extends GetRequestBase<NoParameter, number> {
    constructor(protected credential: { userId: string; userWalletId: string }) {
        super(credential);
    }
    // todo decorator
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

export class GetCreationAvailableWallets extends GetRequestBase<NoParameter, {}> {
    public url: () => string;
}
