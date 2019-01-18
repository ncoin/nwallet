import { PipeTransform, Pipe } from '@angular/core';
import { CurrencyService } from '../../services/nwallet/currency.service';

@Pipe({
    name : 'numberToCryptoFull'
})
export class NumberToCryptoFullPipe implements PipeTransform {
    constructor(private currency: CurrencyService) {}

    transform(value: number, currencyId: number) {
        const decimalNumber = this.currency.getDecimalNumber(currencyId);
        const formattedValue = value.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: decimalNumber
        });
        return formattedValue;
    }
}
