import { NWalletProtocolBase } from './_impl';
import { NoQuery, MethodTypes } from '../../http/protocol';
import { WalletApiPaths } from './paths';
import { NWAsset } from '../../nwallet';

/** Create new Wallets */

export class CreateWallet extends NWalletProtocolBase<NoQuery, { userId: number; currencyId: number; bitgoWalletId: number }, NWAsset.Data> {
    public method = MethodTypes.POST;
    errorMessages: {
        400: 'InvalidFormat';
        406: 'WalletAlreadyCreated';
    };

    public url = () => WalletApiPaths.post.createWallet();
}

/** Create ncn Wallet */

export class CreateNCNWallet extends NWalletProtocolBase<NoQuery, { userId: number; currencyId: number; ncoinPublicKey: string }, NWAsset.Data> {
    public method = MethodTypes.POST;
    errorMessages: {
        400: 'InvalidFormat';
        406: 'WalletAlreadyCreated';
    };

    public url = () => WalletApiPaths.post.createWallet();
}
