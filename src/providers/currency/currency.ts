import { Logger } from './../common/logger/logger';
import { Injectable } from '@angular/core';
import { Subscription, BehaviorSubject } from 'rxjs/Rx';

export interface CurrencyInfo {
    name: string;
    symbol: string;
    price: number;
}

@Injectable()
export class CurrencyProvider {
    // injected by http module

    private currencyInfos: Map<string, BehaviorSubject<CurrencyInfo>>;

    constructor(private logger: Logger) {
        this.currencyInfos = new Map<string, BehaviorSubject<CurrencyInfo>>();
        this.sync();
    }

    private sync(): void {

    }

    public getCurrencyInfo(id: string): BehaviorSubject<CurrencyInfo> {
        if (!this.currencyInfos.has(id)) {
            this.currencyInfos.set(
                id,
                new BehaviorSubject<CurrencyInfo>({
                    name: 'unknown',
                    symbol: 'unknown',
                    price: 0.001,
                }),
            );
        }

        return this.currencyInfos.get(id);
    }
}
