import { NoQuery, NoPayload } from '../../http/protocol';

import { Paths } from './paths';
import { NClientProtocolBase } from './_impl';
import { MethodTypes } from '../../http/protocol';
import { NWResponse } from '../../nwallet';

export class GetTickers extends NClientProtocolBase<NoQuery, NoPayload, NWResponse.Ticker[]> {
    public method = MethodTypes.GET;
    public url = () => Paths.get.ticker();
}
