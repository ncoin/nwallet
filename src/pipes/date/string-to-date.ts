import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
    name : 'stringToDate'
})
export class StringToDatePipe implements PipeTransform {
    transform(value: any, ...args: any[]) {
        return new Date(value);
    }
}
