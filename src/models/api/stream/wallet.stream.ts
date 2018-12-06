import { NWalletStream } from './nwallet.stream';
import { StreamType, WalletStreamData } from '../../../interfaces/stream';
import { Debug } from '../../../utils/helper/debug';

export class WalletStream extends NWalletStream<WalletStreamData[]> {
    protected type = StreamType.Wallet;

    protected process(json: any) {
        Debug.assert(json);

        const walletData = JSON.parse(json) as WalletStreamData[];
        return walletData;
    }
}
