import { NoQuery, NoConvert, MethodTypes, NoPayload } from '../../http/protocol';
import { NWResponse } from '../../nwallet';
import { Paths } from './paths';
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
    public url = () => Paths.get.sendAssetFee(this.credential.userId, this.credential.userWalletId);
}
export class SendAsset extends NClientProtocolBase<NoQuery, { recipient_address: string; amount: number }, NWResponse.Transaction.Detail> {
    public method = MethodTypes.POST;
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
