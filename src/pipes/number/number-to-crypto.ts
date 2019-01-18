import { PipeTransform, Pipe } from '@angular/core';
import { CurrencyService } from '../../services/nwallet/currency.service';

@Pipe({
    name : 'numberToCrypto'
})
export class NumberToCryptoPipe implements PipeTransform {
    constructor(private currency: CurrencyService) {}

    transform(value: number, currencyId: number) {
        const decimalNumber = this.currency.getDecimalNumber(currencyId);
        const maxDigits = 3;
        const formattedValue = value.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: ((decimalNumber > maxDigits) ? maxDigits : decimalNumber)
        });
        return formattedValue;
    }
}