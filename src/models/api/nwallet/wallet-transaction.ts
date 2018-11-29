import { NWTransaction, NWResponse } from '../../nwallet';
import { WalletApiPaths } from './paths';
import { NClientProtocolBase } from './_impl';
import { MethodTypes, NoPayload } from '../../http/protocol';

export class GetWalletTransactions extends NClientProtocolBase<{ offset: number; limit: number }, NoPayload, NWResponse.Transaction.Data[]> {
    public method = MethodTypes.GET;
    public data: NWTransaction.Item[];
    constructor(public credential: { userId: string; userWalletId: number }) {
        super(credential);
    }
    public url = () => WalletApiPaths.get.walletTransactions(this.credential.userId, this.credential.userWalletId);

    public manufacture() {
        this.data = this.response.map(data => new NWTransaction.Item(data));
    }
}
