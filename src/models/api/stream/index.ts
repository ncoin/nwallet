import { TickerStream } from './ticker.stream';
import { WalletStream } from './wallet.stream';
import { NWalletStream } from './nwallet.stream';

const NOTIFICATIONS = [TickerStream, WalletStream];
export { NWalletStream, NOTIFICATIONS };
