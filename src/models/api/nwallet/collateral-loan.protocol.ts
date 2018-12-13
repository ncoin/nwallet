import { NWalletProtocolBase } from './_impl';
import { NoQuery, NoPayload, MethodTypes } from '../../http/protocol';
import { WalletApiPaths } from './paths';

export class CollateralLoan extends NWalletProtocolBase<NoQuery, { collateralId: number; amount: number }, { success: boolean }> {
    public method = MethodTypes.POST;
    errorMessages = {
        400: 'InvalidFormat|InsufficientAmount'
    };
    public url: () => string = () => WalletApiPaths.post.collateralLoan(this.path.collateralId);

    constructor(private path: { collateralId: number }) {
        super();
    }
}
