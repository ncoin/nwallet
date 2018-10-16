import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { env } from '../../environments/environment';
import { TokenProvider } from '../token/token';

@Injectable()
export class NotificationService {
    constructor(private token: TokenProvider) {}

    private stream: {
        wallet: EventSource;
        ticker: EventSource;
    };
    private push: any;

    public async startStream(): Promise<void> {
        const token = await this.token.getToken();

        const walletUrl = env.endpoint.stream('wallet', token.getValue());
        const tickerUrl = env.endpoint.stream('ticker', token.getValue());

        const walletEvent = new EventSource(walletUrl, { withCredentials: true });
        const tickerEvent = new EventSource(tickerUrl, { withCredentials: true });

        walletEvent.addEventListener('wallet', this.onWalletEvent);
        tickerEvent.addEventListener('ticker', this.onTickerEvent);
        this.stream = {
            wallet: walletEvent,
            ticker: tickerEvent
        };
    }

    private closeStream(): void {
        this.stream.ticker.removeEventListener('ticker', this.onTickerEvent);
        this.stream.wallet.removeEventListener('wallet', this.onWalletEvent);
    }

    public onWalletEvent = (data: any): void => {};
    public onTickerEvent = (data: any): void => {};
}
