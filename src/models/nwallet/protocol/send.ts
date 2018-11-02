import { PostProtocolBase, GetProtocolBase, NoQuery, NoConvert } from './http/http-protocol';
import { NWTransaction } from '../../nwallet';
import { Paths } from './http/paths';

export class GetSendAssetFee extends GetProtocolBase<NoQuery, number, NoConvert> {
    /**
     *Creates an instance of GetSendAssetFeeRequest.
     * @param {{ userId: string; userWalletId: number }} credential
     * @resposne fee amount
     * @memberof GetSendAssetFeeRequest
     */
    constructor(protected credential: { userId: string; userWalletId: number }) {
        super(credential);
    }
    public url = () => Paths.get.sendAssetFee(this.credential.userId, this.credential.userWalletId);
}
export class PostSendAsset extends PostProtocolBase<{ recipient_address: string; amount: number }, NWTransaction.Detail, NoConvert> {
    /**
     *Creates an instance of SendAssetRequest.
     * @param {{ userId: string; userWalletId: number }} credential
     * @response transaction detail
     * @memberof SendAssetRequest
     */
    constructor(protected credential: { userId: string; userWalletId: number }) {
        super(credential);
    }

    public url = () => Paths.post.sendAsset(this.credential.userId, this.credential.userWalletId);
}
