import { NoQuery, MethodTypes } from '../../http/protocol';
import { NWalletProtocolBase } from './_impl';
import { WalletApiPaths } from './paths';

export class CreateWalletTrust extends NWalletProtocolBase<NoQuery, { walletId: number }, { xdr: string }> {
    public method = MethodTypes.POST;
    public url = () => WalletApiPaths.post.createTrust(this.payload.walletId);
}

export class ExecuteWalletTrust extends NWalletProtocolBase<NoQuery, { walletId: number; xdr: string }, { success: boolean }> {
    public method = MethodTypes.PUT;
    public url = () => WalletApiPaths.put.executeTrust(this.payload.walletId);
}
