import { GetProtocolBase, NoQuery, NoConvert, PutProtocolBase, NoResponse, Paths } from './http/http-protocol';
import { NWAsset, NWTransaction } from '../../nwallet';

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

export class GetWalletTransactionsProtocol extends GetProtocolBase<{ offset: number; limit: number }, NWTransaction.Data[], NWTransaction.Item[]> {
    constructor(protected credential: { userId: string; userWalletId: number }) {
        super(credential);
    }
    public url = () => Paths.get.walletTransactions(this.credential.userId, this.credential.userWalletId);
}

export class CreateWalletProtocol extends PutProtocolBase<
    {
        currency_manage_id: string;
    },
    NoResponse,
    NoConvert
> {
    public url = () => Paths.post.createWallet(this.credential.userId);
}
export class GetCreationAvailableWalletsProtocol extends GetProtocolBase<NoQuery, NoResponse, NoConvert> {
    public url: () => string;
}
