import { NWAsset, NWTransaction, NWAccount } from '../../models/nwallet';
import { Subscription } from 'rxjs';

export interface AccountSubject {
    assets: (func: (asset: NWAsset.Item[]) => void) => Subscription;
    assetTransactions: (walletId: number, func: (asset: NWTransaction.Item[]) => void) => Subscription;
}

export class AccountCallbackImpl implements AccountSubject {
    assets: (func: (asset: NWAsset.Item[]) => void) => Subscription;
    assetTransactions: (walletId: number, func: (asset: NWTransaction.Item[]) => void) => Subscription;

    constructor(private account: NWAccount.Account) {
        this.assets = assetExpr => this.account.inventory.getAssetItems().subscribe(assetExpr);
        this.assetTransactions = (walletId, transactionExpr) => this.account.inventory.getTransaction(walletId).subscribe(transactionExpr);
    }
}
