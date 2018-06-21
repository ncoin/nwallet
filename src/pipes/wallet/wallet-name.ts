import { Pipe, PipeTransform } from '@angular/core';
import { NWallet } from '../../interfaces/nwallet';

@Pipe({
    name: 'walletName',
})
export class WalletNamePipe implements PipeTransform {
    static nameDic = new Map<string, string>([['NCH', 'NCash'], ['NCN', 'NCoin'], ['XLM', 'Stellar Lumen']]);

    transform(item: NWallet.WalletItem) {
        if (item.isNative === true && WalletNamePipe.nameDic.has(item.asset.code)) {
            return WalletNamePipe.nameDic.get(item.asset.code);
        }

        return item.asset.code;
    }
}
