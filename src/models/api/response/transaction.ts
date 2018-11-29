import * as Transaction from '../../nwallet/transaction';

declare module '../../nwallet/transaction' {
    interface Data {
        id: number;
        user_wallet_id: number;
        main_transaction_type: string;
        transaction_type: string;
        from_address: string;
        to_address: string;
        amount: number;
        occur_date: string;
        created_by: string;
        created_date: string;

        bc_status_type: string;
        bc_transaction_id: string;
        fee: number;
        last_modified_by: string;
        last_modified_date: string;
        succeed: boolean;
        transfer_id: string;
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

export { Transaction };
