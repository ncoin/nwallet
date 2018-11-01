import { GetProtocolBase, NoQuery, NoConvert, PutProtocolBase, NoResponse } from './http/http-protocol';
import { Paths } from './http/paths';
import { NWAsset } from '../../nwallet';

export class GetWalletProtocol extends GetProtocolBase<NoQuery, NWAsset.Data[], NWAsset.Item[]> {
    // todo decorator
    public url = () => Paths.get.wallets(this.credential.userId);
}

export class GetWalletDetailProtocol extends GetProtocolBase<NoQuery, number, NoConvert> {
    constructor(protected credential: { userId: string; userWalletId: number }) {
        super(credential);
    }
    public url = () => Paths.get.walletDetail(this.credential.userId, this.credential.userWalletId);
}

export class CreateWalletProtocol extends PutProtocolBase<{ currency_manage_id: string }, NoResponse, NoConvert> {
    public url = () => Paths.post.createWallet(this.credential.userId);
}

export class GetCreationAvailableWalletsProtocol extends GetProtocolBase<NoQuery, NoResponse, NoConvert> {
    public url: () => string;
}

export class PutWalletAlignProtocol extends PutProtocolBase<{ user_wallet_ids: number[] }, NoResponse, number[]> {
    public url = () => Paths.put.walletAlign(this.credential.userId);
}

export class PutWalletVisibilityProtocol extends PutProtocolBase<{ is_show: boolean }, NoResponse, { walletId: number; isVisible: boolean }> {
    constructor(protected credential: { userId: string; userWalletId: number }) {
        super(credential);
    }
    public url = () => Paths.put.walletVisibility(this.credential.userId, this.credential.userWalletId);
}
