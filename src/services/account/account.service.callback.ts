import { NWAsset, NWTransaction } from '../../models/nwallet';
import { Subscription } from 'rxjs';

export interface AccountStream {
    assets: (func: (asset: NWAsset.Item[]) => void) => Subscription;
    assetTransactions: (walletId: number, func: (asset: NWTransaction.Item[]) => void) => Subscription;
}
