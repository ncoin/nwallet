import { NWalletProtocolBase } from './_impl';
import { NoQuery, NoPayload, MethodTypes } from '../../http/protocol';
import { WalletApiPaths } from './paths';
import { NWAsset } from '../../nwallet';

export class BuyNcn extends NWalletProtocolBase<NoQuery, { walletId: number; userId: number; amount: number }, NWAsset.Data> {
    public method = MethodTypes.POST;
    errorMessages = {
        400: 'InvalidFormat|InsufficientAmount',
        404: 'WalletNotExist'
    };
    public url: () => string = () => WalletApiPaths.post.buyNcn(this.path.walletId);

    constructor(private path: { walletId: number }) {
        super();
    }
}
