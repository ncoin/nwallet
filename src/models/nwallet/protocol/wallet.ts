import { GetProtocolBase, NoQuery, NoConvert, PutProtocolBase, NoResponse, PostProtocolBase, NoPayload } from './http/http-protocol';
import { Paths } from './http/paths';
import { NWAsset } from '../../nwallet';

/** Get Wallets */
export class GetWallets extends GetProtocolBase<NoQuery, NWAsset.Data[], NWAsset.Item[]> {
    // todo decorator
    public url = () => Paths.get.wallets(this.credential.userId);
}

/** Create new Wallets */

export class CreateWallet extends PostProtocolBase<NoPayload, NoResponse, NoConvert> {
    public url = () => Paths.post.createWallet(this.credential.userId);
}

/** Get Wallet Details */
export class GetWalletDetail extends GetProtocolBase<NoQuery, number, NoConvert> {
    constructor(protected credential: { userId: string; userWalletId: number }) {
        super(credential);
    }
    public url = () => Paths.get.walletDetail(this.credential.userId, this.credential.userWalletId);
}

/** Change Wallet Visibiltiy */
export class PutWalletVisibility extends PutProtocolBase<{ is_show: boolean }, NoResponse, { walletId: number; isVisible: boolean }> {
    constructor(protected credential: { userId: string; userWalletId: number }) {
        super(credential);
    }

    public url = () => Paths.put.walletVisibility(this.credential.userId, this.credential.userWalletId);
    public convert = () => ({ walletId: this.credential.userWalletId, isVisible: this.payload.is_show });
}

/** Change Wallet Order */
export class PutWalletAlign extends PutProtocolBase<{ user_wallet_ids: number[] }, NoResponse, number[]> {
    public url = () => Paths.put.walletAlign(this.credential.userId);
}

/** Get Creation Available Wallet List */
export class AvailableWallet extends GetProtocolBase<NoQuery, NWAsset.Available[], NWAsset.Available[]> {
    public url = () => Paths.get.creationAvailableWallets(this.credential.userId);
    public convert = () => this.response.map(available => Object.assign(new NWAsset.Available(available)));
}
