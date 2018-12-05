import { Injectable } from '@angular/core';
import { env } from '../../environments/environment';
import { AuthorizationService } from './authorization.service';
import { Debug } from '../../utils/helper/debug';
import { EventService } from '../common/event/event';
import { NWEvent } from '../../interfaces/events';
import { LoggerService } from '../common/logger/logger.service';
import { NWResponse } from '../../models/nwallet';

export class WalletProtocol {
    address: string;
    align_number: number;
    balance: number;
    bitgo_wallet_id: number;
    created_date: string;
    currency: string;
    currency_manage_id: number;
    id: number;
    is_loaned: number;
    is_show: number;
    last_modified_date: string;
    user_id: number;
}

@Injectable()
export class NotificationService {
    private stream: {
        wallet?: EventSource;
        ticker?: EventSource;
    } = {};

    private push: any;

    constructor(private auth: AuthorizationService, private event: EventService, private logger: LoggerService) {
        this.event.subscribe(NWEvent.App.user_login, () => {
            this.openStream();
        });
        this.event.subscribe(NWEvent.App.user_logout, () => {
            this.closeStream();
        });
    }

    private async openStream(): Promise<void> {
        this.logger.debug('[notification][openstream] request token');
        const token = await this.auth.getToken();

        if (!token) {
            this.logger.debug('[notification][openstream] request token failed');
        }

        const value = token ? token.getValue() : '';

        const walletUrl = env.endpoint.stream('wallet', value);
        const tickerUrl = env.endpoint.stream('ticker', value);

        const walletEvent = new EventSource(walletUrl, { withCredentials: true });
        const tickerEvent = new EventSource(tickerUrl, { withCredentials: true });
        walletEvent.addEventListener('wallet', this.onWalletEvent);
        tickerEvent.addEventListener('ticker', this.onTickerEvent);

        this.stream.wallet = walletEvent;
        this.stream.ticker = tickerEvent;
    }

    private closeStream(): void {
        this.stream.ticker.removeEventListener('ticker', this.onTickerEvent);
        this.stream.wallet.removeEventListener('wallet', this.onWalletEvent);
        this.stream.ticker.close();
        this.stream.wallet.close();
    }

    public flush(): void {
        this.closeStream();
        this.stream.ticker = undefined;
        this.stream.wallet = undefined;
    }

    private onWalletEvent = (event: MessageEvent): void => {
        const walletData = JSON.parse(event.data) as WalletProtocol[];
        this.logger.debug('[notification] on wallet :', walletData);

        this.event.publish(NWEvent.Stream.wallet, walletData);
    }

    private onTickerEvent = (event: MessageEvent): void => {
        const tickerData = JSON.parse(event.data) as NWResponse.Ticker;
        tickerData.last_updated_date_raw = new Date(Number.parseInt(tickerData.last_updated_date, 10));
        Debug.Validate(tickerData);
        this.logger.debug('[notification] on ticker :', tickerData);

        this.event.publish(NWEvent.Stream.ticker, tickerData);
    }
}