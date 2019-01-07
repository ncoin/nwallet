import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { EventService } from '../common/event/event.service';
import { NWEvent } from '../../interfaces/events';
import { ChannelService } from './channel.service';
import { NWData, NWProtocol, NWResponse } from '../../models/nwallet';

// todo move
class CurrencyInfo {
    data: NWData.Currency;
    ticker: NWData.Ticker;

    constructor(public currencyId: number) {
    }

    public get decimalNumber(): number {
        if (this.data) {
            return this.data.decimal_number;
        }
        return 0;
    }

    public get price(): number {
        if (this.ticker) {
            return this.ticker.price;
        }
        return 0;
    }

    public updateTicker(ticker: NWResponse.Ticker) {
        this.ticker = ticker;
        this.ticker.last_updated_date_raw = new Date(Number.parseInt(ticker.last_updated_date, 10));
    }
}

@Injectable()
export class CurrencyService {
    private currencies: Map<number, BehaviorSubject<CurrencyInfo>> = new Map<number, BehaviorSubject<CurrencyInfo>>();
    public currencyChanged: Observable<CurrencyInfo>;

    constructor(event: EventService, private channel: ChannelService) {
        this.currencyChanged = new Subject<CurrencyInfo>();

        this.channel.register(NWProtocol.GetTickers, protocol => {
            protocol.response.forEach(ticker =>
                this.addOrUpdate(ticker.currency_id, info => {
                    info.updateTicker(ticker);
                })
            );
        });

        this.channel.register(NWProtocol.GetCurrency, protocol => {
            protocol.response.forEach(currency => this.addOrUpdate(currency.id, info => (info.data = currency)));
        });

        this.channel.register(NWProtocol.GetWallets, protocol => {
            protocol.data.forEach(asset => {
                const currencyInfo = this.get(asset.getCurrencyId()).getValue();
                if (currencyInfo.data) {
                    asset.setCurrency(currencyInfo.data);
                }
            });
        });

        event.subscribe(NWEvent.Stream.ticker, ticker => {
            this.addOrUpdate(ticker.currency_id, info => {
                // todo
                info.updateTicker(<NWData.Ticker>ticker);
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

    public getDecimalNumber(currencyId: number): number {
        return this.get(currencyId).getValue().decimalNumber;
    }
}
