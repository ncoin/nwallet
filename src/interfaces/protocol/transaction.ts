import { Data } from '../../models/nwallet/transaction';

declare module '../../models/nwallet/transaction' {
    interface Data {
        id: number;
        user_wallet_id: number;
        main_transaction_type: string;
        transaction_type: string;
        transaction_type_value: string;
        transaction_id: string;
        from_address: string;
        to_address: string;
        amount: number;
        balance: number;
        occur_date: string;
        occur_yyyy: string;
        occur_eng_mm: string;
        occur_dd: string;
        status_type: string;
        response_detail: Detail;
        created_by: string;
        created_date: string;
    }

    interface Detail {
        id: string;
        coin: string;
        wallet: string;
        enterprise: string;
        txid: string;
        height: number;
        date: string;
        confirmations: number;
        type: string;
        value: number;
        valueString: number;
        feeString: number;
        payGoFee: number;
        payGoFeeString: number;
        usd: number;
        usdRate: number;
        state: string;
        instant: boolean;
        tags: string[];
        history: History[];
        vSize?: number;
        nSegwitInputs?: number;
        entries: Entry[];
        signedTime?: string;
        confirmedTime?: string;
        createdTime: string;
        tx?: string;
    }

    interface History {
        date: Date;
        action: string;
    }

    interface Entry {
        address: string;
        wallet: string;
        value: number;
        valueString: string;
        isChange?: boolean;
        isPayGo: boolean;
    }
}
