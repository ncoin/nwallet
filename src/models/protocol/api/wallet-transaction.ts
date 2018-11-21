import { NWTransaction, NWResponse } from '../../nwallet';
import { Paths } from './paths';
import { NClientProtocolBase } from './http-protocol';
import { MethodTypes, NoPayload } from '../../http/http-protocol';

export class GetWalletTransactions extends NClientProtocolBase<{ offset: number; limit: number }, NoPayload, NWResponse.Transaction.Data[]> {
    public method = MethodTypes.GET;
    public data: NWTransaction.Item[];
    constructor(protected credential: { userId: string; userWalletId: number }) {
        super(credential);
    }
    public url = () => Paths.get.walletTransactions(this.credential.userId, this.credential.userWalletId);

    public manufacture() {
        this.data = this.response.map(data => new NWTransaction.Item(data));
    }
}
