import { Pipe, PipeTransform } from '@angular/core';
import { NWallet } from '../../interfaces/nwallet';

@Pipe({
    name: 'assetFormat',
})
export class AssetFormatPipe implements PipeTransform {
    transform(wallet: NWallet.AssetContext) {
        const value = Number.parseFloat(wallet.amount);
         const floor = Math.floor(value * 100) / 100;
        return `${floor} ${wallet.item.asset.code}`;
    }
}
