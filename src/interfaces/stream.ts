export enum StreamType {
    Wallet = 'wallet',
    Ticker = 'ticker'
}

// todo
export interface TickerStreamData {
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

// todo
export interface WalletStreamData {
    address: string;
    align_number: number;
    balance: number;
    bitgo_wallet_id: number;
    created_date: string;
    currency: string;
    currency_manage_id: number;
    id: number;
    is_loaned: number;
    is_show: number;
    last_modified_date: string;
    user_id: number;
}
