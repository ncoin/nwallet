import { Component, Input } from '@angular/core';
import { NWAsset } from '../../models/nwallet';

/**
 * Generated class for the AssetItemComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
    selector: 'nw-asset-item',
    templateUrl: 'asset-item.html',
})
export class AssetItemComponent {
    @Input()
    asset: NWAsset.Item;
}
