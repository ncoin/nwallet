import { NWTransaction } from '../../nwallet';
import { Paths } from './paths';
import { NClientProtocolBase } from './http-protocol';
import { MethodTypes, NoPayload } from '../../http/http-protocol';

export class GetWalletTransactions extends NClientProtocolBase<{ offset: number; limit: number }, NoPayload, NWTransaction.Data[]> {
    public method = MethodTypes.GET;
    constructor(protected credential: { userId: string; userWalletId: number }) {
        super(credential);
    }
    public url = () => Paths.get.walletTransactions(this.credential.userId, this.credential.userWalletId);
}
