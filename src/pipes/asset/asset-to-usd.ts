import { Pipe, PipeTransform } from '@angular/core';
import { NWAsset } from '../../models/nwallet';
import { CurrencyService } from '../../providers/nsus/currency.service';
import { Debug } from '../../utils/helper/debug';

/**
 * Generated class for the CurrencyFormatPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
    name: 'assetToUSD'
})
export class AssetToUSDPipe implements PipeTransform {
    constructor(private currency: CurrencyService) {}

    /**
     * Takes a value and makes it lowercase.
     */
    transform(assetItem: NWAsset.Item) {
        return this.currency.getOrAdd(assetItem.data.currency_manage_id).map(currency => {
            Debug.assert(assetItem.data.currency_manage_id === currency.currency_manage_id && currency.price);

            // todo move --sky
            assetItem.detail.price = currency.price;

            const value = assetItem.amount * currency.price;
            const floor = value.toFixed(2);
            return `$${floor}`;
        });
    }
}
