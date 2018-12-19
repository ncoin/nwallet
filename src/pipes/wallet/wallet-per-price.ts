import { Pipe, PipeTransform } from '@angular/core';
import { NWAsset } from '../../models/nwallet';
import { CurrencyService } from '../../services/nwallet/currency.service';
import { Debug } from '../../utils/helper/debug';

@Pipe({
    name: 'walletPerPrice'
})
export class WalletPerPricePipe implements PipeTransform {
    constructor(private currency: CurrencyService) {}

    transform(assetItem: NWAsset.Item) {
        return this.currency.getPrice(assetItem.getCurrencyId());
    }
}
