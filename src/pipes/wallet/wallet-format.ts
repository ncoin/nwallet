import { Pipe, PipeTransform } from '@angular/core';
import { NWallet } from '../../interfaces/nwallet';

@Pipe({
    name: 'walletFormat',
})
export class WalletFormatPipe implements PipeTransform {
    transform(wallet: NWallet.WalletContext) {
        const value = Number.parseFloat(wallet.amount);
        // const floor = Math.floor(value * 100) / 100;
        return `${value} ${wallet.item.asset.code}`;
    }
}
