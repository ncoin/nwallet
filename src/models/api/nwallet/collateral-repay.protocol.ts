import { NWalletProtocolBase } from './_impl';
import { NoQuery, NoPayload, MethodTypes } from '../../http/protocol';
import { WalletApiPaths } from './paths';

export class CreateCollateralRepay extends NWalletProtocolBase<NoQuery, { collateralId: number; amount: number }, { xdr: string }> {
    public method = MethodTypes.POST;
    constructor(private path: { collateralId: number }) {
        super();
    }
    public isXdr(): boolean {
        return this.isSuccess() && this.response.xdr !== undefined;
    }
    public url: () => string = () => WalletApiPaths.post.collateralLoan(this.path.collateralId);
}

export class ExecuteCollateralRepay extends NWalletProtocolBase<NoQuery, { collateralId: number; xdr: string }, { success: boolean }> {
    public method = MethodTypes.PUT;
    constructor(private path: { collateralId: number }) {
        super();
    }
    public url: () => string = () => WalletApiPaths.put.collateralRepayExecute(this.path.collateralId);
}
