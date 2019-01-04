import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import { NWAsset } from '../../models/nwallet';

@Pipe({
    name: 'walletToFormat',
})
export class WalletToFormatPipe implements PipeTransform {
    transform(assetItem: NWAsset.Item) {
        const digits = (assetItem.currency.decimal_number > 2) ? 3 : assetItem.currency.decimal_number;
        const value = assetItem.getAmount();
        const floor = _.floor(value, digits);
        const formattedValue = floor.toLocaleString('en-US');
        return `${formattedValue} ${assetItem.getSymbol()}`;
    }
}
