import { NWalletProtocolBase } from './_impl';
import { NoQuery, NoPayload, MethodTypes } from '../../http/protocol';
import { WalletApiPaths } from './paths';

export class CollateralExecute extends NWalletProtocolBase<NoQuery, { collateralId: number; amount: number }, { success: boolean }> {
    public method = MethodTypes.POST;
    constructor(private path: { collateralId: number }) {
        super();
    }
    public url: () => string = () => WalletApiPaths.post.collateralExecute(this.path.collateralId);
}
