import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
    name : 'numberToUsd'
})
export class NumberToUsdPipe implements PipeTransform {
    transform(value: number) {
        const formattedValue = value.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        return `$${formattedValue}`;
    }
}
