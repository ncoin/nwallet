import { Component } from '@angular/core';
import { NavController, ModalController, IonicPage } from 'ionic-angular';
import { AccountService } from '../../../../providers/account/account.service';
import { NWAsset } from '../../../../models/nwallet';

@IonicPage()
@Component({
    selector: 'add-wallet',
    templateUrl: 'add-wallet.page.html'
})
export class AddWalletPage {
    totalPrice: string;
    public _searchText = '';
    public assets: NWAsset.Item[] = [];
    constructor(public navCtrl: NavController, private accont: AccountService) {
        this.init();
    }

    public get searchText(): string {
        return this._searchText;
    }

    public set searchText(value: string) {
        this._searchText = value;
        this.init();
        this.onFilterAsset(value);
    }

    private async init(): Promise<void> {
        this.assets = [];
        const account = await this.accont.detail();
        const inventory = account.inventory;
        this.assets.push(...inventory.assetItems);
    }

    private onFilterAsset(value: string): void {
        if (value && value.trim() !== '') {
            this.assets = this.assets.filter(item => {
                return item.detail.symbol.trim().toLowerCase().indexOf(value.trim().toLowerCase()) > -1;
            });
        }
    }

    public onClick_AddAsset(asset: NWAsset.Item): void {
        asset.option.isActive = true;
        asset.option.isShow = true;
    }
}
