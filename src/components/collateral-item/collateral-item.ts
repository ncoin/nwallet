import { Component, Input } from '@angular/core';
import { NWAsset } from '../../models/nwallet';

@Component({
    selector: 'nw-collateral-item',
    templateUrl: 'collateral-item.html'
})
export class CollateralItemComponent {
    @Input()
    wallet: NWAsset.Item;
}
