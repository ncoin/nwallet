import { NWalletProtocolBase } from './_impl';
import { NoQuery, NoPayload, MethodTypes } from '../../http/protocol';
import { NWResponse } from '../../nwallet';
import { WalletApiPaths } from './paths';

export class GetAvailable extends NWalletProtocolBase<NoQuery, NoPayload, NWResponse.Asset.Available[]> {
    public method = MethodTypes.GET;
    public url = () => WalletApiPaths.get.creationAvailableWallets(this.credential.userId);
    public manufacture() {}
}
