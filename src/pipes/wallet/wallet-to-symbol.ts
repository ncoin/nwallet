import { Pipe, PipeTransform } from '@angular/core';
import { NWAsset } from '../../models/nwallet';
import { CurrencyService } from '../../services/nwallet/currency.service';

@Pipe({
    name: 'walletToSymbol'
})
export class WalletToSymbolPipe implements PipeTransform {
    constructor(private currency: CurrencyService) {}

    transform(assetItem: NWAsset.Item) {
        return this.currency.get(assetItem.data.currency_id).map(currency => currency.data.label);
    }
}
