import { NWalletStream } from './nwallet.stream';
import { StreamType, WalletStreamData } from '../../../interfaces/stream';

export class WalletStream extends NWalletStream<WalletStreamData[]> {
    protected type = StreamType.Wallet;

    protected process(json: any) {
        const walletData = JSON.parse(json) as WalletStreamData[];
        return walletData;
    }
}
