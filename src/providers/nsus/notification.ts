import { Injectable } from '@angular/core';
import { env } from '../../environments/environment';
import { TokenService } from '../token/token.service';
import { Debug } from '../../utils/helper/debug';
import { EventService } from '../common/event/event';
import { NWEvent } from '../../interfaces/events';

export class TickerProtocol {
    site: string;
    symbol: string;
    currency_manage_id: number;
    created_by: string;
    asset_code: string;
    name: string;
    price: number;
    last_updated_date: Date;
}

export class WalletProtocol {

}

@Injectable()
export class NotificationService {
    private stream: {
        wallet?: EventSource;
        ticker?: EventSource;
    };

    private push: any;

    constructor(private token: TokenService, private event: EventService) {
        this.stream = {};
    }


    public async openStream(): Promise<void> {
        const token = await this.token.getToken();

        const walletUrl = env.endpoint.stream('wallet', token.getValue());
        const tickerUrl = env.endpoint.stream('ticker', token.getValue());

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

    public onWalletEvent = (event: MessageEvent): void => {
        const walletData = JSON.parse(event.data) as WalletProtocol;
        this.event.publish(NWEvent.Stream.wallet, walletData);
    }
    public onTickerEvent = (event: MessageEvent): void => {
        const tickerData = JSON.parse(event.data) as TickerProtocol;

        tickerData.last_updated_date = new Date(Number.parseInt(tickerData.last_updated_date.toString(), 10));
        Debug.Validate(tickerData);
        Debug.Assert(tickerData);

        this.event.publish(NWEvent.Stream.ticker, tickerData);
    }
}
