import { NoQuery, NoPayload } from '../../http/http-protocol';

import { Paths } from './paths';
import { NClientProtocolBase } from './http-protocol';
import { MethodTypes } from '../../http/http-protocol';
import { NWResponse } from '../../nwallet';

export class GetTickers extends NClientProtocolBase<NoQuery, NoPayload, NWResponse.Ticker[]> {
    public method = MethodTypes.GET;
    public url = () => Paths.get.ticker(this.credential.userId);
}
