import { NWalletProtocolBase } from './_impl';
import { MethodTypes, NoPayload } from '../../http/protocol';
import { WalletApiPaths } from './paths';
import { NWResponse, NWTransaction } from '../../nwallet';

export class CollateralTransactions extends NWalletProtocolBase<
    { collateralId: number; offset: number; limit: number; order?: 'ASC' | 'DESC' },
    NoPayload,
    NWResponse.Transaction.Collateral[]
> {
    public data: NWTransaction.Collateral[];

    public method = MethodTypes.GET;
    constructor(private path: { collateralId: number }) {
        super();
    }

    public setQuery(query: { collateralId: number; offset: number; limit: number; order?: 'ASC' | 'DESC' }): this {
        if (!query.order) {
            query.order = <'DESC'>`[['id','DESC']]`;
        } else {
            query.order = <any>`[['id','${query.order}']]`;
        }

        super.setQuery(query);
        return this;
    }

    public manufacture() {
        this.data = this.response.map(c => new NWTransaction.Collateral(c));
    }

    public url: () => string = () => WalletApiPaths.get.collateralTransactions(this.path.collateralId);
}
