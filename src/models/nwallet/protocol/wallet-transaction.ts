import { GetProtocolBase } from './http/http-protocol';
import { NWTransaction } from '../../nwallet';
import { Paths } from './http/paths';

export class GetWalletTransactions extends GetProtocolBase<{ offset: number; limit: number }, NWTransaction.Data[], NWTransaction.Item[]> {
    constructor(protected credential: { userId: string; userWalletId: number }) {
        super(credential);
    }
    public url = () => Paths.get.walletTransactions(this.credential.userId, this.credential.userWalletId);
}
