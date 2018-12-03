import { Ticker } from '../../nwallet/ticker';
declare module '../../nwallet/ticker' {
    interface Ticker {
        asset_code: string;
        created_by: string;
        created_date: string;
        currency_id: number;
        id: number;
        last_modified_by: string;
        last_modified_date: string;
        last_updated_date: string;
        name: string;
        price: number;
        site: string;
        symbol: string;
    }
}

export { Ticker };
