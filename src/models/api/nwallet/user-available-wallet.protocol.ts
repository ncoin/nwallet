import { NWalletProtocolBase } from './_impl';
import { NoQuery, NoPayload, MethodTypes } from '../../http/protocol';
import { NWResponse, NWAsset } from '../../nwallet';
import { WalletApiPaths } from './paths';

/** Get Creation Available Wallet List */
export class GetAvailableWallet extends NWalletProtocolBase<NoQuery, NoPayload, NWResponse.Asset.Available[]> {
    public method = MethodTypes.GET;
    public data: NWAsset.Available[];
    public url = () => WalletApiPaths.get.availableWallets(this.credential.userId);

    public manufacture() {
        this.data = this.response.map(available => new NWAsset.Available(available));
    }
}
