import { Pipe, PipeTransform } from '@angular/core';
import { NWallet } from '../../interfaces/nwallet';

/**
 * Generated class for the CurrencyFormatPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
    name: 'walletToUSD',
})
// USD only (fix it later!)
export class WalletToUSDPipe implements PipeTransform {
    /**
     * Takes a value and makes it lowercase.
     */
    transform(wallet: NWallet.WalletContext) {
        const value = Number.parseFloat(wallet.amount) * wallet.item.price;
        const floor = Math.floor(value * 100) / 100;
        return `$${floor} USD`;
    }
}
