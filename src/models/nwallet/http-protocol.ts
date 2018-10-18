import { GetRequestBase, PutRequestBase, NoParameter } from './http-protocol-base';
import { NWAsset } from '../nwallet';
import { Debug } from '../../utils/helper/debug';

export class GetWalletRequest extends GetRequestBase<NoParameter, NWAsset.Data[]> {

    public getPath(): string {
        Debug.assert(this.userId);
        return `users/${this.userId}/wallets`;
    }
}

export class CreateWallet extends PutRequestBase<{ currency_manage_id: string; align_number: number }> {}
