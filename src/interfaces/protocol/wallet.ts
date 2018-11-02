import { WalletAvailable } from '../../models/nwallet/wallet';

declare module '../../models/nwallet/asset' {
    interface Available {
        id: number;
        currency: string;
        bitgo_symbol: string;
        is_use_wallet: number;
        align_number: number;
    }
}
