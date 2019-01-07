import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import { NWAsset } from '../../models/nwallet';
import { CurrencyService } from '../../services/nwallet/currency.service';
import { Debug } from '../../utils/helper/debug';

@Pipe({
    name: 'walletToAvailablePrice'
})
export class WalletToAvailablePricePipe implements PipeTransform {
    constructor(private currency: CurrencyService) {}

    transform(assetItem: NWAsset.Item) {
        const digits = 2;
        return this.currency.get(assetItem.data.currency_id).map(currency => {
            const price = currency.price;
            const availableBalance = assetItem.data.available_withdrawal_balance;
            const floor = _.floor((availableBalance * price), digits);
            const formattedValue = floor.toLocaleString('en-US', {
                minimumFractionDigits: digits,
                maximumFractionDigits: digits
            });

            return `$${formattedValue}`;
        });
    }
}
