import * as Asset from '../../nwallet/asset';
// todo move location
declare module '../../nwallet/asset' {
    interface Data {
        id: number;
        bitgo_wallet_id: number;
        currency_manage_id: number;
        currency: string;
        user_id: string;
        address: string;
        balance: number;
        lock_balance: number;
        loan_amt: number;
        current_ltv: number;
        align_number: number;
        is_show: boolean | number;
        created_date: Date;
        last_modified_date: Date;
    }

    /** asset option protocol */
    interface Option {
        /** show/hide flag */
        isShow: boolean;
        /** wallet activation flag */
        isActive: boolean;
        /** wallet order index */
        order: number;
    }

    interface Available {
        id: number;
        currency: string;
        bitgo_symbol: string;
        is_use_wallet: number;
        align_number: number;
    }
}

export { Asset };
