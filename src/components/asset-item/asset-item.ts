import { Component, Input } from '@angular/core';
import { NWAsset } from '../../models/nwallet';

@Component({
    selector: 'nw-asset-item',
    templateUrl: 'asset-item.html',
})
export class AssetItemComponent {
    @Input()
    asset: NWAsset.Item;
}
