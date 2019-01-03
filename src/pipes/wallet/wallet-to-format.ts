import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import { NWAsset } from '../../models/nwallet';

@Pipe({
    name: 'walletToFormat',
})
export class WalletToFormatPipe implements PipeTransform {
    transform(assetItem: NWAsset.Item) {
        const value = assetItem.getAmount();
        const floor = _.floor(value, 3);
        const formattedValue = floor.toLocaleString('en-US');
        return `${formattedValue} ${assetItem.getSymbol()}`;
    }
}
