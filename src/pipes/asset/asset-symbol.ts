import { Pipe, PipeTransform } from '@angular/core';
import { NWAsset } from '../../models/nwallet';
import { CurrencyService } from '../../services/nsus/currency.service';

@Pipe({
    name: 'assetToSymbol'
})
export class AssetSymbolPipe implements PipeTransform {
    constructor(private currency: CurrencyService) {}

    transform(assetItem: NWAsset.Item) {
        return this.currency.get(assetItem.data.currency_id).map(currency => {
            return currency.data.label;
        });
    }
}
