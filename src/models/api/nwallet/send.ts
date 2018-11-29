import { NoQuery, NoConvert, MethodTypes, NoPayload } from '../../http/protocol';
import { NWResponse } from '../../nwallet';
import { WalletApiPaths } from './paths';
import { NClientProtocolBase } from './_impl';

export class GetSendAssetFee extends NClientProtocolBase<NoQuery, NoPayload, number> {
    public method = MethodTypes.GET;
    /**
     *Creates an instance of GetSendAssetFeeRequest.
     * @param {{ userId: string; userWalletId: number }} credential
     * @resposne fee amount
     * @memberof GetSendAssetFeeRequest
     */
    constructor(protected credential: { userId: string; userWalletId: number }) {
        super(credential);
    }
    public url = () => WalletApiPaths.get.sendAssetFee(this.credential.userId, this.credential.userWalletId);
}
export class SendAsset extends NClientProtocolBase<NoQuery, { walletId: number; recipientAddress: string; amount: number }, { xdr?: string; id: number }> {
    public method = MethodTypes.POST;
    constructor(protected userWalletId: number) {
        super();
    }

    public isXdr(): boolean {
        return this.isSuccess() && this.response.xdr !== undefined;
    }

    public url = () => WalletApiPaths.post.sendAsset(this.userWalletId);
}

export class SendAssetXdr extends NClientProtocolBase<NoQuery, { walletId: number; transactionId: number; xdr: string }, { success: boolean }> {
    public method = MethodTypes.PUT;
    constructor(protected userWalletId: number) {
        super();
    }

    public url = () => WalletApiPaths.put.sendAssetXdr(this.userWalletId);
}
