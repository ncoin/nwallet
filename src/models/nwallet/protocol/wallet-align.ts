import { PutRequestBase } from '../http-protocol-base';
import { Paths } from '../http-protocol';

export class PutWalletAlignRequest extends PutRequestBase<{ user_wallet_ids: number[] }> {
    public url = () => Paths.put.walletAlign(this.credential.userId);
}
