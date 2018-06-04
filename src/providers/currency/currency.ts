import { Observable } from 'rxjs/Observable';
import { Logger } from './../common/logger/logger';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {} from 'rxjs/add/operator/in';
import { Observer, Subscription, BehaviorSubject } from 'rxjs/Rx';
/*
  Generated class for the CurrencyProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
export enum CurrencyId {
    BTC = "1",
    XLM = "512",
}

const api: (currency: CurrencyId) => string = (currency): string => {
    return `https://api.coinmarketcap.com/v2/ticker/${currency}/`;
};

interface CurrencyInfo {
    id: string;
    name: string;
    symbol: string;
    price: number;
}

@Injectable()
export class CurrencyProvider {
    // injected by http module

    private currencyInfos: Map<string, BehaviorSubject<CurrencyInfo>>;
    public currencyStream: Subscription;

    //for debug
    private observer:Observer<CurrencyInfo>;

    constructor(private http: HttpClient, private logger: Logger) {
        this.currencyInfos = new Map<string, BehaviorSubject<CurrencyInfo>>();
        this.init();
        this.sync();
    }

    private init(): void {
        this.observer = {
            next: currency => {
                this.logger.debug('currency', currency);
                const subject = this.getCurrencyInfo(currency.id);
                subject.next(currency);
            },
            error: e => {
                this.logger.warn('failed to get currency', e);
            },
            complete: () => {},
        };

        const NCH =  <CurrencyInfo>{
            id : "-1",
            name : "NCash",
            symbol : "NCH",
            price : 1
        };

        const NCN = <CurrencyInfo>{
            id : "-2",
            name : "NCoin",
            symbol : "NCN",
            price : 0.03
        };

        Observable.timer(0, 5000).subscribe(() => {
            this.observer.next(NCH);
            this.getCurrencyInfo(NCH.id).next(NCH);
            this.observer.next(NCN);
            this.getCurrencyInfo(NCN.id).next(NCN);
        });
    }

    private sync(): void {
        const apiRequests = Observable.from(Object.keys(CurrencyId)).flatMap(currency => this.http.get(api(CurrencyId[currency])).map(this.getData));

        this.currencyStream = Observable.timer(0,5000).flatMap(() => apiRequests).subscribe(this.observer);
    }

    public getCurrencyInfo(id: string): BehaviorSubject<CurrencyInfo> {
        if (!this.currencyInfos.has(id)) {
            this.currencyInfos.set(id, new BehaviorSubject<CurrencyInfo>({
                id : id,
                name : "unknown",
                symbol : "unknown",
                price : 0.001,
            }));
        }

        return this.currencyInfos.get(id);
    }

    private getData(data: Object): CurrencyInfo {
        return <CurrencyInfo>{
            id: data['data']['id'].toString(),
            name: data['data']['name'],
            symbol: data['data']['symbol'],
            price: data['data']['quotes']['USD']['price'],
        };
    }
}
