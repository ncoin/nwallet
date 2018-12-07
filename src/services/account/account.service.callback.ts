import { NWAsset, NWTransaction, NWAccount } from '../../models/nwallet';
import { Subscription } from 'rxjs';
import { Debug } from '../../utils/helper/debug';

export class AccountSubject {
    constructor(private account: NWAccount.Account) {
        Debug.assert(account.inventory);
    }

    public assetChanged(expr: (asset: NWAsset.Item[]) => void): Subscription {
        return this.account.inventory.getAssetItems().subscribe(expr);
    }
    public assetTransactionsChanged(walletId: number, expr: (asset: NWTransaction.Item[]) => void): Subscription {
        return this.account.inventory.getTransaction(walletId).subscribe(expr);
    }
}
