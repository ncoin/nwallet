import { PostProtocolBase, GetProtocolBase, NoQuery } from '../http-protocol-base';
import { Paths } from '../http-protocol';
import { NWTransaction } from '../../nwallet';

export class GetSendAssetFeeProtocol extends GetProtocolBase<NoQuery, number> {
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
export class SendAssetProtocol extends PostProtocolBase<{ recipient_address: string; amount: number }, NWTransaction.Detail> {
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
