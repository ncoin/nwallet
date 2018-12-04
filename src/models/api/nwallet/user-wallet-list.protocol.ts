import { NWalletProtocolBase } from './_impl';
import { NoQuery, NoPayload, MethodTypes } from '../../http/protocol';
import { NWResponse, NWAsset } from '../../nwallet';
import { WalletApiPaths } from './paths';

/** Get Wallets */
export class GetWallets extends NWalletProtocolBase<NoQuery, NoPayload, NWResponse.Asset.Data[]> {
    public method = MethodTypes.GET;
    public data: NWAsset.Item[];
    // todo decorator
    public url = () => WalletApiPaths.get.wallets(this.credential.userId);

    public manufacture() {
        this.data = this.response.map(data => new NWAsset.Item(data));
    }
}
