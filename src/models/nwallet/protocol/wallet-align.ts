import { PutProtocolBase, NoResponse, Paths } from './http/http-protocol';

export class PutWalletAlignProtocol extends PutProtocolBase<{ user_wallet_ids: number[] }, NoResponse, number[]> {
    public url = () => Paths.put.walletAlign(this.credential.userId);
}
