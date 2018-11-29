import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { EventService } from '../common/event/event';
import { NWEvent } from '../../interfaces/events';
import { NsusChannelService } from './nsus-channel.service';
import { NWData, NWProtocol } from '../../models/nwallet';

class CurrencyInfo {
    data: NWData.Currency;
    ticker: NWData.Ticker;

    constructor(public currencyId: number) {}
    public get price(): number {
        if (this.ticker) {
            return this.ticker.price;
        }
        return 0;
    }
}

@Injectable()
export class CurrencyService {
    private currencies: Map<number, BehaviorSubject<CurrencyInfo>> = new Map<number, BehaviorSubject<CurrencyInfo>>();
    public currencyChanged: Observable<CurrencyInfo>;

    constructor(event: EventService, private channel: NsusChannelService) {
        this.currencyChanged = new Subject<CurrencyInfo>();

        event.subscribe(NWEvent.Stream.ticker, ticker => {
            this.addOrUpdate(ticker.currency_id, info => (info.ticker = ticker));
        });

        this.channel.register(NWProtocol.GetTickers, protocol => {
            protocol.response.forEach(ticker => {
                this.addOrUpdate(ticker.currency_id, info => (info.ticker = ticker));
            });
        });

        this.channel.register(NWProtocol.GetCurrency, protocol => {
            protocol.response.forEach(currency => {
                this.addOrUpdate(currency.id, info => (info.data = currency));
            });
        });
    }

    public addOrUpdate(currencyId: number, func: (currency: CurrencyInfo) => void): Subject<CurrencyInfo> {
        const currencyInfo = this.get(currencyId);
        const value = currencyInfo.value;
        func(value);
        currencyInfo.next(value);

        (<Subject<CurrencyInfo>>this.currencyChanged).next(value);
        return currencyInfo;
    }

    public get(currencyId: number): BehaviorSubject<CurrencyInfo> {
        let subject: BehaviorSubject<CurrencyInfo>;
        if (this.currencies.has(currencyId)) {
            subject = this.currencies.get(currencyId);
        } else {
            subject = this.currencies.set(currencyId, new BehaviorSubject<CurrencyInfo>(new CurrencyInfo(currencyId))).get(currencyId);
        }

        return subject;
    }

    public getPrice(currencyId: number): number {
        return this.get(currencyId).getValue().price;
    }
}
