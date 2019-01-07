import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import { NWAsset } from '../../models/nwallet';
import { CurrencyService } from '../../services/nwallet/currency.service';
import { Debug } from '../../utils/helper/debug';

@Pipe({
    name: 'walletToUSD'
})
export class WalletToUSDPipe implements PipeTransform {
    constructor(private currency: CurrencyService) {}

    /**
     * Takes a value and makes it lowercase.
     */
    transform(assetItem: NWAsset.Item) {
        return this.currency.get(assetItem.data.currency_id).map(currency => {
            Debug.assert(assetItem.getCurrencyId() === currency.currencyId);

            const digits = 2;
            const value = assetItem.getAmount() * currency.price;
            const floor = _.floor(value, digits);
            const formattedValue = floor.toLocaleString('en-US', {
                minimumFractionDigits: digits,
                maximumFractionDigits: digits
            });
            return `$${formattedValue}`;
        });
    }
}
