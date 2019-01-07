import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import { NWAsset } from '../../models/nwallet';
import { CurrencyService } from '../../services/nwallet/currency.service';
import { Debug } from '../../utils/helper/debug';

@Pipe({
    name: 'walletPerPrice'
})
export class WalletPerPricePipe implements PipeTransform {
    constructor(private currency: CurrencyService) {}

    transform(assetItem: NWAsset.Item) {
        const digits = 2;
        const floor = _.floor(this.currency.getPrice(assetItem.getCurrencyId()), digits);
        const formattedValue = floor.toLocaleString('en-US', {
            minimumFractionDigits: digits,
            maximumFractionDigits: digits
        });

        return `$${formattedValue}`;
    }
}
