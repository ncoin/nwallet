import { TranslateService } from '@ngx-translate/core';
import { Pipe, PipeTransform } from '@angular/core';
import { NWallet } from '../../interfaces/nwallet';

@Pipe({
    name: 'assetName',
})
export class WalletNamePipe implements PipeTransform {
    constructor(private translate: TranslateService) {}
    transform(item: NWallet.AssetItem) {
        if (item.isNative === true) {
            return this.translate.instant(item.asset.code);
        }

        return item.asset.code;
    }
}
