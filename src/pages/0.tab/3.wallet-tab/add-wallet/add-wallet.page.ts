import { Component } from '@angular/core';
import { NavController, ModalController,  IonicPage,  } from 'ionic-angular';
import { AccountService } from '../../../../providers/account/account.service';
import { NWAsset } from '../../../../models/nwallet';

@IonicPage()
@Component({
    selector: 'add-wallet',
    templateUrl: 'add-wallet.page.html'
})
export class AddWalletPage {
    totalPrice: string;

    public assets: NWAsset.Item[] = [];
    constructor(public navCtrl: NavController, private accont: AccountService) {
        this.init();
    }

    async init(): Promise<void> {
        const inventory = this.accont.account_new.inventory;
        this.assets.push(...inventory.assetItems);
    }

    public onClick_AddAsset(asset: NWAsset.Item): void {
        asset.option.isActive = true;
        asset.option.isShow = true;
    }
}
