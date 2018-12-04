import { NWalletProtocolBase } from './_impl';

import { NoQuery, NoResponseData, MethodTypes } from '../../http/protocol';

import { WalletApiPaths } from './paths';

/** Change Wallet Option
 * isShow : Visibility
 */
export class WalletOptionChange extends NWalletProtocolBase<NoQuery, { isShow: boolean }, NoResponseData> {
    public method = MethodTypes.PUT;
    public data: { walletId: number; isVisible: boolean };
    constructor(public credential: { userId: string; userWalletId: number }) {
        super(credential);
    }

    public url = () => WalletApiPaths.put.walletVisibility(this.credential.userId, this.credential.userWalletId);

    public manufacture() {
        this.data = { walletId: this.credential.userWalletId, isVisible: this.payload.isShow };
        return this;
    }
}
