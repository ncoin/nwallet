import { Currency } from '../../nwallet/currency';
declare module '../../nwallet/currency' {
    interface Currency {
        activated: number;
        align_number: number;
        block_scan_url: string;
        can_loan: number;
        created_by: string;
        created_date: string;
        decimal_number: number;
        fee: number;
        id: number;
        label: string;
        last_modified_by: string;
        last_modified_date: string;
        liquidation_ltv: number;
        max_ltv: number;
        platform: string;
        symbol: string;
    }
}

export { Currency };
