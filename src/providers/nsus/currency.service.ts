import { Injectable } from '@angular/core';

interface CurrencyInfo {
    currency_manage_id: number;
    price: number;
}

@Injectable()
export class CurrencyService {
    private currencies: Map<number, CurrencyInfo> = new Map<number, CurrencyInfo>();
    constructor() {}

    public addOrUpdate(currencyId: number, price: number): CurrencyInfo {
        let currency: CurrencyInfo;
        if (this.currencies.has(currencyId)) {
            currency = this.currencies.get(currencyId);
        } else {
            currency = this.currencies
                .set(currencyId, {
                    currency_manage_id: currencyId,
                    price: price
                })
                .get(currencyId);
        }
        currency.price = price;
        return currency;
    }
    public getOrAdd(currencyId: number): CurrencyInfo {
        if (this.currencies.has(currencyId)) {
            return this.currencies.get(currencyId);
        } else {
            return this.currencies
                .set(currencyId, {
                    currency_manage_id: currencyId,
                    price: -1
                })
                .get(currencyId);
        }
    }
}
