import { TranslateService } from '@ngx-translate/core';
import { Pipe, PipeTransform } from '@angular/core';
import { NWallet } from '../../interfaces/nwallet';

@Pipe({
    name: 'walletName',
})
export class WalletNamePipe implements PipeTransform {
    constructor(private translate:TranslateService){

    }
    transform(item: NWallet.WalletItem) {
        if (item.isNative === true) {
            return this.translate.instant(item.asset.code);
        }

        return item.asset.code;
    }
}
