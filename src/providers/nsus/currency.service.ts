import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { EventService } from '../common/event/event';
import { NWEvent } from '../../interfaces/events';

interface CurrencyInfo {
    currency_manage_id: number;
    price: number;
}

@Injectable()
export class CurrencyService {
    private currencies: Map<number, Subject<CurrencyInfo>> = new Map<number, Subject<CurrencyInfo>>();
    constructor(event: EventService) {
        event.subscribe(NWEvent.Stream.ticker, ticker => {
            this.addOrUpdate(ticker.currency_manage_id, ticker.price);
        });
    }

    public addOrUpdate(currencyId: number, price: number): Subject<CurrencyInfo> {
        const currency = this.getOrAdd(currencyId);
        currency.next({
            currency_manage_id: currencyId,
            price: price
        });
        return currency;
    }

    public getOrAdd(currencyId: number): Subject<CurrencyInfo> {
        return this.currencies.has(currencyId) ? this.currencies.get(currencyId) : this.currencies.set(currencyId, new BehaviorSubject<CurrencyInfo>({
            currency_manage_id : currencyId,
            price : 1,
        })).get(currencyId);
    }
}
