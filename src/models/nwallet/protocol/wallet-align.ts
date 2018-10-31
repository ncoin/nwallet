import { PutProtocolBase, NoResponse } from '../http-protocol-base';
import { Paths } from '../http-protocol';

export class PutWalletAlignProtocol extends PutProtocolBase<{ user_wallet_ids: number[] }, NoResponse> {
    public url = () => Paths.put.walletAlign(this.credential.userId);
}
