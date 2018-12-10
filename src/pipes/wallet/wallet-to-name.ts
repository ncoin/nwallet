import { TranslateService } from '@ngx-translate/core';
import { Pipe, PipeTransform } from '@angular/core';
import { NWAsset } from '../../models/nwallet';

/** obsoleted --sky` */
@Pipe({
    name: 'walletToFullName'
})
export class WalletToFullNamePipe implements PipeTransform {
    constructor(private translate: TranslateService) {}
    transform(item: NWAsset.Item) {
        return this.translate.get(item.getSymbol());
        // return this.translate.instant(item.detail.symbol);
    }
}
