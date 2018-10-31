import { GetProtocolBase, NoQuery, NoConvert, Paths } from './http/http-protocol';


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

export class GetTickerProtocol extends GetProtocolBase<NoQuery, Ticker[], NoConvert> {
    public url = () => Paths.get.ticker(this.credential.userId);
}
