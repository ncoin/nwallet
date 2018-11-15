import { Pipe, PipeTransform } from '@angular/core';
import { NWAsset } from '../../models/nwallet';

@Pipe({
    name: 'assetFormat',
})
export class AssetFormatPipe implements PipeTransform {
    transform(assetItem: NWAsset.Item) {
        const value = assetItem.getAmount();
        const floor = Math.floor(value * 1000) / 1000;
        return `${floor} ${assetItem.getSymbol()}`;
    }
}
