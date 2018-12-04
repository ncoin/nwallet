import { NWalletProtocolBase } from './_impl';
import { NoQuery, NoResponseData, MethodTypes } from '../../http/protocol';
import { WalletApiPaths } from './paths';

/** Change Wallet Order */
export class SetWalletAlign extends NWalletProtocolBase<NoQuery, { alignNumbers: number[] }, NoResponseData> {
    public method = MethodTypes.PUT;
    public data: number[];
    public url = () => WalletApiPaths.put.walletAlign(this.credential.userId);
    public manufacture() {
        this.data = this.payload.alignNumbers;
    }
}
