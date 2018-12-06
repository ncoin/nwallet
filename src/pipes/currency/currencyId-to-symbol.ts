import { Pipe, PipeTransform } from '@angular/core';
import { NWAsset } from '../../models/nwallet';
import { CurrencyService } from '../../services/nwallet/currency.service';

@Pipe({
    name: 'currencyIdToSymbol'
})
export class CurrencyIdToSymbolPipe implements PipeTransform {
    constructor(private currency: CurrencyService) {}

    transform(currencyId: number) {
        return this.currency.get(currencyId).map(currency => {
            return currency.data.label;
        });
    }
}
