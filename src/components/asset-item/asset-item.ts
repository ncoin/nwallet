import { Component, Input } from '@angular/core';
import { NWallet } from '../../interfaces/nwallet';

/**
 * Generated class for the AssetItemComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
    selector: 'asset-item',
    templateUrl: 'asset-item.html',
})
export class AssetItemComponent {
    @Input() asset: NWallet.WalletContext;

    constructor() {
        console.log('heelo');
    }
}
