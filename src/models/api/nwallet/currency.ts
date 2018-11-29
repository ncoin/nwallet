import { NClientProtocolBase } from './_impl';
import { NoQuery, NoPayload, MethodTypes } from '../../http/protocol';
import { Paths } from './paths';
import { NWResponse, NWData } from '../../nwallet';

export class GetCurrency extends NClientProtocolBase<NoQuery, NoPayload, NWResponse.Currency[]> {
    public method = MethodTypes.GET;
    public url: () => string = () => Paths.get.currency();
}
