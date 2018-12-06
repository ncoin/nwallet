import { NWalletStream } from './nwallet.stream';
import { StreamType, TickerStreamData } from '../../../interfaces/stream';
import { Debug } from '../../../utils/helper/debug';

export class TickerStream extends NWalletStream<TickerStreamData> {
    protected type = StreamType.Ticker;

    protected process(json: any): TickerStreamData {
        Debug.assert(json);

        const tickerData = JSON.parse(json) as TickerStreamData;
        return tickerData;
    }
}
