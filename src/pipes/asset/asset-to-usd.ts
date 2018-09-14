import { Pipe, PipeTransform } from '@angular/core';
import { NWallet } from '../../interfaces/nwallet';

/**
 * Generated class for the CurrencyFormatPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
    name: 'assetToUSD',
})
// USD only (fix it later!)
export class AssetToUSDPipe implements PipeTransform {
    /**
     * Takes a value and makes it lowercase.
     */
    transform(wallet: NWallet.AssetContext) {
        const value = Number.parseFloat(wallet.amount) * wallet.item.price;
        const floor = value.toFixed(2);
        return `$${floor} USD`;
    }
}
