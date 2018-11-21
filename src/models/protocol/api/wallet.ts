import { NoQuery, NoConvert, NoResponseData, MethodTypes, NoPayload } from '../../http/http-protocol';
import { Paths } from './paths';
import { NWAsset } from '../../nwallet';
import { NClientProtocolBase } from './http-protocol';

/** Get Wallets */
export class GetWallets extends NClientProtocolBase<NoQuery, NoPayload, NWAsset.Data[]> {
    public method = MethodTypes.GET;
    // todo decorator
    public url = () => Paths.get.wallets(this.credential.userId);
}

/** Create new Wallets */

export class CreateWallet extends NClientProtocolBase<NoQuery, { currency_manage_id: number }> {
    public method = MethodTypes.POST;
    public url = () => Paths.post.createWallet(this.credential.userId);
}

/** Get Wallet Details */
export class GetWalletDetail extends NClientProtocolBase<NoQuery, NoPayload, NWAsset.Data> {
    public method = MethodTypes.GET;
    constructor(protected credential: { userId: string; userWalletId: number }) {
        super(credential);
    }
    public url = () => Paths.get.walletDetail(this.credential.userId, this.credential.userWalletId);
}

/** Change Wallet Visibiltiy */
export class PutWalletVisibility extends NClientProtocolBase<NoQuery, { is_show: boolean }, NoResponseData> {
    public method = MethodTypes.PUT;
    constructor(protected credential: { userId: string; userWalletId: number }) {
        super(credential);
    }

    public url = () => Paths.put.walletVisibility(this.credential.userId, this.credential.userWalletId);
}

/** Change Wallet Order */
export class PutWalletAlign extends NClientProtocolBase<NoQuery, { user_wallet_ids: number[] }, NoResponseData> {
    public method = MethodTypes.PUT;
    public url = () => Paths.put.walletAlign(this.credential.userId);
}

/** Get Creation Available Wallet List */
export class AvailableWallet extends NClientProtocolBase<NoQuery, NoPayload, NWAsset.Available[]> {
    public method = MethodTypes.GET;
    public url = () => Paths.get.creationAvailableWallets(this.credential.userId);
}
