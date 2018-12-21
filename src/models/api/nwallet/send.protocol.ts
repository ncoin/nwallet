import { NoQuery, NoConvert, MethodTypes, NoPayload } from '../../http/protocol';
import { NWResponse } from '../../nwallet';
import { WalletApiPaths } from './paths';
import { NWalletProtocolBase } from './_impl';

export class SendAsset extends NWalletProtocolBase<NoQuery, { walletId: number; recipientAddress: string; amount: number }, { xdr?: string; id: number }> {
    public method = MethodTypes.POST;
    constructor(protected walletId: number) {
        super();
    }

    public isXdr(): boolean {
        return this.response.xdr !== undefined;
    }

    public url = () => WalletApiPaths.post.sendAsset(this.walletId);
}

export class SendAssetXdr extends NWalletProtocolBase<NoQuery, { walletId: number; transactionId: number; xdr: string }, { success: boolean }> {
    public method = MethodTypes.PUT;
    constructor(protected walletId: number) {
        super();
    }

    public url = () => WalletApiPaths.put.sendAssetXdr(this.walletId);
}
