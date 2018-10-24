import { Pipe, PipeTransform } from '@angular/core';
import { NWAsset } from '../../models/nwallet';

@Pipe({
    name: 'assetFormat',
})
export class AssetFormatPipe implements PipeTransform {
    transform(assetItem: NWAsset.Item) {
        const value = assetItem.getAmount();
        const floor = Math.floor(value * 100) / 100;
        return `${floor} ${assetItem.getSymbol()}`;
    }
}
