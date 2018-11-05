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
    constructor(public navCtrl: NavController, private accont: AccountService, private channel: NsusChannelService) {
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
        const wallets = await this.channel.getAvailableWallets();
        this.assets.push(...wallets);
    }

    private onFilterAsset(value: string): void {
        if (value && value.trim() !== '') {
            this.assets = this.assets.filter(item => {
                return item.getSymbol().trim().toLowerCase().indexOf(value.trim().toLowerCase()) > -1;
            });
        }
    }

    public onClick_AddAsset(asset: NWAsset.Available): void {
        // this.channel.createWallet
    }
}
