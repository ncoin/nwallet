import { Logger } from './../common/logger/logger';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {} from 'rxjs/add/operator/in';
import { Observable, Subject } from 'rxjs/Rx';
/*
  Generated class for the CurrencyProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
export enum CurrencyId {
    BTC = '1',
    XLM = '512',
}

const api: (currency: CurrencyId) => string = (currency): string => {
    return `https://api.coinmarketcap.com/v2/ticker/${currency}/`;
};

interface CurrencyInfo {
    id: number;
    name: string;
    symbol: string;
    price: number;
}

@Injectable()
export class CurrencyProvider {
    // injected by http module

    private currencyInfos: Map<number, Subject<CurrencyInfo>>;
    public currencyStream: Observable<CurrencyInfo>;
    constructor(private http: HttpClient, private logger: Logger) {
        this.currencyInfos = new Map<number, Subject<CurrencyInfo>>();
        this.sync();
    }

    private sync(): void {
        const apiRequests = Observable.from(Object.keys(CurrencyId)).flatMap(currency => this.http.get(api(CurrencyId[currency])).map(this.getData));
        this.currencyStream = Observable.interval(5000).flatMap(() => apiRequests);
        this.currencyStream.subscribe({
            next: currency => {
                this.logger.debug('currency', currency);
                const subject = this.getCurrencyInfo(currency.id);
                subject.next(currency);
            },
            error: e => {
                this.logger.warn('failed to get currency', e);
            },
            complete: () => {},
        });
    }

    private getCurrencyInfo(id: number): Subject<CurrencyInfo> {
        if (!this.currencyInfos.has(id)) {
            this.currencyInfos.set(id, new Subject<CurrencyInfo>());
        }

        return this.currencyInfos.get(id);
    }

    private getData(data: Object): CurrencyInfo {
        return <CurrencyInfo>{
            id: data['data']['id'],
            name: data['data']['name'],
            symbol: data['data']['symbol'],
            price: data['data']['quotes']['USD']['price'],
        };
    }
}
