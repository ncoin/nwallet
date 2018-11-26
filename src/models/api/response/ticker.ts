import { Ticker } from '../../nwallet/ticker';
declare module '../../nwallet/ticker' {
    interface Ticker {
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
}

export { Ticker };
