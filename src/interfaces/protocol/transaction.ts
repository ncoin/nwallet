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
        id: '5bc03f39c67663b003e9cbdf46164036';
        coin: 'teth';
        wallet: '5ba3acea0bfdd2b5030b5fa2d24b1586';
        enterprise: '5ba3a61e248ba8a703e6c0f232067586';
        txid: '0x47be910e536346456464f94df38a40f2bfaa259cf1a5de0cc853498cd9673723';
        height: 9047235;
        date: Date;
        confirmations: 47438;
        type: 'receive';
        value: 70000000000000000;
        valueString: '70000000000000000';
        feeString: '329450000000000';
        payGoFee: 0;
        payGoFeeString: '0';
        usd: 13.8166;
        usdRate: 197.38;
        state: 'confirmed';
        instant: false;
        tags: string[];
        history: History[];
        entries: Entry[];
        confirmedTime: Date;
        createdTime: Date;
    }

    interface History {
        date: Date;
        action: 'confirmed';
    }

    interface Entry {
        address: '0xd079c11abd7c0b93e67bb9e75215a716a5c6000c';
        wallet: '5ba3acea0bfdd2b5030b5fa2d24b1586';
        value: 70000000000000000;
        valueString: '70000000000000000';
        isPayGo: false;
    }
}
