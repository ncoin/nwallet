import { NWalletProtocolBase } from './_impl';
import { NoQuery, MethodTypes } from '../../http/protocol';
import { WalletApiPaths } from './paths';

/** Create new Wallets */

export class CreateWallet extends NWalletProtocolBase<NoQuery, { currencyId: number }> {
    public method = MethodTypes.POST;

    public url = () => WalletApiPaths.post.createWallet(this.credential.userId);
}
