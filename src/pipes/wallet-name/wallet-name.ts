import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the WalletNamePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
    name: 'walletName',
})
export class WalletNamePipe implements PipeTransform {
    static nameDic = new Map<string, string>([['NCH', 'NCash'], ['NCN', 'NCoin'], ['XLM', 'Stellar Lumen']]);

    /**
     * Takes a value and makes it lowercase.
     */
    transform(value: string) {
        if (WalletNamePipe.nameDic.has(value)) {
            return WalletNamePipe.nameDic.get(value);
        }

        return `${value}(undefined)`;
    }
}
