import * as Asset from '../../nwallet/asset';
// todo move location
declare module '../../nwallet/asset' {
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
