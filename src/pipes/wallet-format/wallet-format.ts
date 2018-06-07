import { Pipe, PipeTransform } from '@angular/core';
import { NWallet } from '../../interfaces/nwallet';

/**
 * Generated class for the walletFormatPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
    name: 'walletFormat',
})
export class WalletFormatPipe implements PipeTransform {
    /**
     * Takes a value and makes it lowercase.
     */
    transform(wallet: NWallet.WalletItem) {
        const value = Number.parseFloat(wallet.amount);
        const floor = Math.floor(value * 100) / 100;
        return `${floor} ${wallet.asset.code}`;
    }
}
