import * as Transaction from '../../nwallet/transaction';

declare module '../../nwallet/transaction' {
    interface Data {
        amount: number;
        bc_status_type: string;
        bc_transaction_id: number;
        created_by: string;
        created_date: string;
        fee: number;
        from_address: string;
        id: number;
        last_modified_by: string;
        last_modified_date: string;
        succeed: boolean;
        to_address: string;
        transaction_type: string;
        transfer_id: number;
        user_wallet_id: number;
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
