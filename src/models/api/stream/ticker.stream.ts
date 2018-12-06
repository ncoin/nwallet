import { NWalletStream } from './nwallet.stream';
import { StreamType, TickerStreamData } from '../../../interfaces/stream';

export class TickerStream extends NWalletStream<TickerStreamData> {
    protected type = StreamType.Ticker;

    protected process(json: any): TickerStreamData {
        const tickerData = JSON.parse(json) as TickerStreamData;
        return tickerData;
    }
}
