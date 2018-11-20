import { Component } from '@angular/core';
import { NavController, ModalController, IonicPage } from 'ionic-angular';
import { AccountService } from '../../../../providers/account/account.service';
import { NWAsset } from '../../../../models/nwallet';
import { NsusChannelService } from '../../../../providers/nsus/nsus-channel.service';

@IonicPage()
@Component({
    selector: 'add-wallet',
    templateUrl: 'add-wallet.page.html'
})
export class AddWalletPage {
    totalPrice: string;
    public _searchText = '';
    public assets: NWAsset.Available[] = [];
    public sourceAssets: NWAsset.Available[] = [];
    constructor(public navCtrl: NavController, private accont: AccountService, private channel: NsusChannelService) {
        this.assets = [];
        this.init();
    }

    public get searchText(): string {
        return this._searchText;
    }

    public set searchText(value: string) {
        this._searchText = value;
        this.onFilterAsset(value);
    }

    private async init(): Promise<void> {
        const wallets = await this.channel.getAvailableWallets();
        this.sourceAssets.push(...wallets);
        this.assets = this.sourceAssets.slice();
    }

    private onFilterAsset(value: string): void {
        if (value && value.trim() !== '') {
            this.assets = this.sourceAssets.filter(
                item =>
                    item
                        .getSymbol()
                        .trim()
                        .toLowerCase()
                        .indexOf(value.trim().toLowerCase()) > -1
            );
        } else {
            this.assets = this.sourceAssets.slice();
        }
    }

    public onClick_AddAsset(asset: NWAsset.Available): void {
        if (this.channel.createWallet(asset.id)) {
            this.sourceAssets.splice(this.sourceAssets.indexOf(asset), 1);
            this.assets.splice(this.assets.indexOf(asset), 1);
        }
    }
}
