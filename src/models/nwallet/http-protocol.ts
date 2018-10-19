import { GetRequestBase, PutRequestBase, NoParameter, HttpRequestBase } from './http-protocol-base';
import { NWAsset } from '../nwallet';
import { Debug } from '../../utils/helper/debug';
import { TypeDecorator, Type, Component } from '@angular/core';

export interface HttpProtocolDecorator {
    url: () => string;
}

function HttpProtocol<T extends { new (...args: any[]): HttpRequestBase }>(prototype: T) {
    return prototype;
}

//todo rework --sky
const Paths = {
    get: {
        wallets: (user_id: string) => `users/${user_id}/wallets`,
        walletDetail: (user_id: string, user_wallet_id: id) => `users/${user_id}/wallets/${user_wallet_id}`
    },

    put: {
        configuraton: (user_id: string) => `users/${user_id}/cofiguration/push`
    }
};

export class GetWalletRequest extends GetRequestBase<NoParameter, NWAsset.Data[]> {
    public url = () => Paths.get.wallets(this.userId);
}

export class GetWalletDetailRequest extends GetRequestBase<NoParameter, number> {
    // todo decorator
    public url = () => Paths.get.walletDetail(this.userId, this.userWalletId);
}

export class CreateWallet extends PutRequestBase<{
    currency_manage_id: string;
    align_number: number;
}> {
    public url = () => Paths.get.wallets(this.userId);
}

export class SetConfigurationRequest extends PutRequestBase<{
    device_id: string;
    is_push_notification: boolean;
}> {
    public url = () => Paths.put.configuraton(this.userId);
}
