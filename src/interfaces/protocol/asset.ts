import { Item } from '../../models/nwallet/asset';

declare module '../../models/nwallet/asset' {
    interface Item {
        /** asset detail */
        detail: Detail;
        /** asset amount */
        amount: string;
        /** asset option */
        option: Option;
    }

    /** asset detail protocol */
    interface Detail {
        /** asset code : ex) BTC, ETH, XRP, BCH,, */
        symbol: string;
        /** internal asset code */
        code: string;
        /** amount per usd price */
        price: number;
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
}
