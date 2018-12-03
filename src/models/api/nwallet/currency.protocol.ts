import { NWalletProtocolBase } from './_impl';
import { NoQuery, NoPayload, MethodTypes } from '../../http/protocol';
import { WalletApiPaths } from './paths';
import { NWResponse, NWData } from '../../nwallet';

export class GetCurrency extends NWalletProtocolBase<NoQuery, NoPayload, NWResponse.Currency[]> {
    public method = MethodTypes.GET;
    public url: () => string = () => WalletApiPaths.get.currency();
}
