import { NoQuery, NoPayload } from '../../http/http-protocol';

import { Paths } from './paths';
import { NClientProtocolBase } from './http-protocol';
import { MethodTypes } from '../../http/http-protocol';

export class Ticker {
    site: string;
    symbol: string;
    currency_manage_id: number;
    created_by: string;
    asset_code: string;
    name: string;
    price: number;

    last_updated_date: string;
    last_updated_date_raw: Date;
}

export class GetTickers extends NClientProtocolBase<NoQuery, NoPayload, Ticker[]> {
    public method = MethodTypes.GET;
    public url = () => Paths.get.ticker(this.credential.userId);
}
