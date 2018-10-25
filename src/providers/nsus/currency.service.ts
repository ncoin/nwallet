import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { EventService } from '../common/event/event';
import { NWEvent } from '../../interfaces/events';

interface CurrencyInfo {
    currencyId: number;
    price: number;
}

@Injectable()
export class CurrencyService {
    private currencies: Map<number, BehaviorSubject<CurrencyInfo>> = new Map<number, BehaviorSubject<CurrencyInfo>>();
    public currencyChanged: Observable<CurrencyInfo>;

    constructor(event: EventService) {
        this.currencyChanged = new Subject<CurrencyInfo>();
        event.subscribe(NWEvent.Stream.ticker, ticker => {
            this.addOrUpdate(ticker.currency_manage_id, ticker.price);
        });
    }

    public addOrUpdate(currencyId: number, price: number): Subject<CurrencyInfo> {
        const currency = this.getOrAdd(currencyId);
        const currencyInfo = {
            currencyId: currencyId,
            price: price
        };
        currency.next(currencyInfo);
        (<Subject<CurrencyInfo>>this.currencyChanged).next(currencyInfo);
        return currency;
    }

    public getOrAdd(currencyId: number): BehaviorSubject<CurrencyInfo> {
        let subject: BehaviorSubject<CurrencyInfo>;
        if (this.currencies.has(currencyId)) {
            subject = this.currencies.get(currencyId);
        } else {
            subject = this.currencies
                .set(
                    currencyId,
                    new BehaviorSubject<CurrencyInfo>({
                        currencyId: currencyId,
                        price: 0
                    })
                )
                .get(currencyId);
        }

        return subject;
    }

    public getPrice(currencyId: number): number {
        return this.getOrAdd(currencyId).getValue().price;
    }
}
