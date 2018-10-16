import { TranslateService } from '@ngx-translate/core';
import { Pipe, PipeTransform } from '@angular/core';
import { NWallet } from '../../interfaces/nwallet';
import { NWAsset } from '../../models/nwallet';

/** obsoleted --sky` */
@Pipe({
    name: 'assetName',
})
export class AssetNamePipe implements PipeTransform {
    constructor(private translate: TranslateService) {}
    transform(item: NWAsset.Item) {
            return this.translate.instant(item.detail.symbol);
        return item.detail.symbol;
    }
}
