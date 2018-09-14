import { Component, Input } from '@angular/core';
import { NWallet } from '../../interfaces/nwallet';
import {NWModalTransition} from "../../tools/extension/transition";
import {WalletDetailPage} from "../../pages/1.detail/wallet-detail.page";
import {ModalController, NavController} from "ionic-angular";

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
    @Input() asset: NWallet.AssetContext;

    constructor(private modalCtrl: ModalController) {

    }

    public onSelectWallet(wallet: NWallet.AssetContext) {
        const modal = this.modalCtrl.create(WalletDetailPage, { wallet: wallet}, NWModalTransition.Slide());
        modal.present();
    }
}
