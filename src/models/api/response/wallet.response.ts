import * as Asset from '../../nwallet/wallet';
// todo move location
declare module '../../nwallet/wallet' {
    interface Data {
        address: string;
        align_number: number;
        balance: number;
        bitgo_wallet_id: number;
        created_date: string;
        currency_id: number;
        id: number;
        user_id: number;
        is_show: boolean;
        last_modified_date: string;

        collateral: Collateral;
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
        currency_id: number;
        label: string;
        symbol: string;
        align_number: number;
        bitgo_wallet_id: number;
    }

    interface Collateral {
        available_loan_amout: number;
        created_date: string;
        expiry_date: string;
        expiry_date_relative_time: string; // it is not 'TimeStamp'
        id: number;
        last_modified_date: string;
        loan_sum: number;
        lock_balance: number;
        ltv: number;
        status: string;
        user_wallet_id: number;
    }
}

export { Asset };
