import { NoQuery, MethodTypes, XDRResponse } from '../../http/protocol';
import { NWalletProtocolBase } from './_impl';
import { WalletApiPaths } from './paths';

/** NCN Wallet create protocol - 1*/
export class CreateWalletTrust extends NWalletProtocolBase<NoQuery, { walletId: number }, XDRResponse> {
    public method = MethodTypes.POST;
    public url = () => WalletApiPaths.post.createTrust(this.payload.walletId);
}

/** NCN Wallet create protocol - 2*/

export class ExecuteWalletTrust extends NWalletProtocolBase<NoQuery, { walletId: number; xdr: string }, { success: boolean }> {
    public method = MethodTypes.PUT;
    public url = () => WalletApiPaths.put.executeTrust(this.payload.walletId);
}
