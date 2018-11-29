import { NoQuery, NoResponseData, MethodTypes, NoPayload } from '../../http/protocol';
import { Paths } from './paths';
import { NWAsset, NWResponse } from '../../nwallet';
import { NClientProtocolBase } from './_impl';

/** Get Wallets */
export class GetWallets extends NClientProtocolBase<NoQuery, NoPayload, NWResponse.Asset.Data[]> {
    public method = MethodTypes.GET;
    public data: NWAsset.Item[];
    // todo decorator
    public url = () => Paths.get.wallets(this.credential.userId);

    public manufacture() {
        this.data = this.response.map(data => new NWAsset.Item(data));
    }
}

/** Create new Wallets */

export class CreateWallet extends NClientProtocolBase<NoQuery, { currencyId: number }> {
    public method = MethodTypes.POST;
    public url = () => Paths.post.createWallet(this.credential.userId);
}

/** Get Wallet Details */
export class GetWalletDetail extends NClientProtocolBase<NoQuery, NoPayload, NWResponse.Asset.Data> {
    public method = MethodTypes.GET;
    constructor(protected credential: { userId: string; userWalletId: number }) {
        super(credential);
    }
    public url = () => Paths.get.walletDetail(this.credential.userId, this.credential.userWalletId);
}

/** Change Wallet Visibiltiy */
export class SetWalletVisibility extends NClientProtocolBase<NoQuery, { isShow: boolean }, NoResponseData> {
    public method = MethodTypes.PUT;
    public data: { walletId: number; isVisible: boolean };
    constructor(public credential: { userId: string; userWalletId: number }) {
        super(credential);
    }

    public url = () => Paths.put.walletVisibility(this.credential.userId, this.credential.userWalletId);

    public manufacture() {
        this.data = { walletId: this.credential.userWalletId, isVisible: this.payload.isShow };
        return this;
    }
}

/** Change Wallet Order */
export class SetWalletAlign extends NClientProtocolBase<NoQuery, { alignNumbers: number[] }, NoResponseData> {
    public method = MethodTypes.PUT;
    public data: number[];
    public url = () => Paths.put.walletAlign(this.credential.userId);
    public manufacture() {
        this.data = this.payload.alignNumbers;
    }
}

/** Get Creation Available Wallet List */
export class GetAvailableWallet extends NClientProtocolBase<NoQuery, NoPayload, NWResponse.Asset.Available[]> {
    public method = MethodTypes.GET;
    public data: NWAsset.Available[];
    public url = () => Paths.get.creationAvailableWallets(this.credential.userId);

    public manufacture() {
        this.data = this.response.map(available => Object.assign(new NWAsset.Available(available)));
    }
}
