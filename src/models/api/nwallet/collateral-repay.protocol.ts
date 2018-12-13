import { NWalletProtocolBase } from './_impl';
import { NoQuery, NoPayload, MethodTypes, XDRResponse } from '../../http/protocol';
import { WalletApiPaths } from './paths';

export class CreateCollateralRepay extends NWalletProtocolBase<NoQuery, { collateralId: number; amount: number }, XDRResponse> {
    public method = MethodTypes.POST;
    errorMessages = {
        400: 'InvalidFormat|InsufficientAmount',
        406: 'WalletAlreadyCreated'
    };
    constructor(private path: { collateralId: number }) {
        super();
    }
    public isXdr(): boolean {
        return this.isSuccess() && this.response.xdr !== undefined;
    }
    public url: () => string = () => WalletApiPaths.post.collateralRepay(this.path.collateralId);
}

export class ExecuteCollateralRepay extends NWalletProtocolBase<NoQuery, { collateralId: number; xdr: string }, { success: boolean }> {
    public method = MethodTypes.PUT;
    errorMessages = {
        400: 'InvalidFormat|InsufficientAmount',
        406: 'WalletAlreadyCreated'
    };

    public url: () => string = () => WalletApiPaths.put.collateralRepayExecute(this.path.collateralId);

    constructor(private path: { collateralId: number }) {
        super();
    }
}
