import { TranslateService } from '@ngx-translate/core';
import { Pipe, PipeTransform } from '@angular/core';
import { NWallet } from '$infrastructure/nwallet';

/** obsoleted --sky` */
@Pipe({
    name: 'assetName'
})
export class AssetNamePipe implements PipeTransform {
    constructor(private translate: TranslateService) {}
    transform(item: NWallet.AssetItem) {
        if (item.isNative === true) {
            return this.translate.instant(item.asset.code);
        }

        return item.asset.code;
    }
}
