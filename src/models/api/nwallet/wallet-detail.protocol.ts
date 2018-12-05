import { NWalletProtocolBase } from './_impl';

import { NoQuery, NoPayload, MethodTypes } from '../../http/protocol';

import { NWResponse } from '../../nwallet';

import { WalletApiPaths } from './paths';

/** Get Wallet Details */
export class GetWalletDetail extends NWalletProtocolBase<NoQuery, NoPayload, NWResponse.Asset.Data> {
    public method = MethodTypes.GET;
    constructor(protected credential: { userId: number; walletId: number }) {
        super(credential);
    }
    public url = () => WalletApiPaths.get.walletDetail(this.credential.userId, this.credential.walletId);
}
