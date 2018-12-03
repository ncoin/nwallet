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
        currency_id: number;
        label: string;
        symbol: string;
        align_number: number;
        bitgo_wallet_id: number;
    }
}

export { Asset };
