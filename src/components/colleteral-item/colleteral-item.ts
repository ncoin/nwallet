import { Component, Input } from '@angular/core';
import { NWAsset } from '../../models/nwallet';

@Component({
    selector: 'nw-colleteral-item',
    templateUrl: 'colleteral-item.html'
})
export class ColleteralItemComponent {
    @Input()
    wallet: NWAsset.Item;
}
