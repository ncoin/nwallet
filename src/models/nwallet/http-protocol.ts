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

const Paths = {
    get: {
        wallet: (user_id: string) => `users/${user_id}/wallets`
    },

    put: {
        configuraton: (user_id: string) => `users/${user_id}/cofiguration/push`
    }
};

export class GetWalletRequest extends GetRequestBase<NoParameter, NWAsset.Data[]> {
    public url = () => Paths.get.wallet(this.userId);
}

export class CreateWallet extends PutRequestBase<{
    currency_manage_id: string;
    align_number: number;
}> {
    public url = () => Paths.get.wallet(this.userId);
}

export class SetConfigurationRequest extends PutRequestBase<{
    device_id: string;
    is_push_notification: boolean;
}> {
    public url = () => Paths.put.configuraton(this.userId);
}
