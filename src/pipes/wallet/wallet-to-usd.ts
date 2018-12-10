import { Pipe, PipeTransform } from '@angular/core';
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

            const value = assetItem.getAmount() * currency.price;
            const floor = value.toFixed(2);
            return `$${floor}`;
        });
    }
}
