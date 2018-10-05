import { ViewChild } from '@angular/core';
import { Component } from '@angular/core';
import { NavController, ModalController, LoadingController, Loading, IonicPage, Navbar } from 'ionic-angular';
import { LoggerService } from '../../../../providers/common/logger/logger.service';
import { AccountService } from '../../../../providers/account/account.service';
import { NWAsset } from '../../../../models/nwallet';
import { Inventory } from '../../../../models/nwallet/inventory';
import { AddWalletPage } from '../add-wallet/add-wallet.page';
import { NWTransition } from '../../../../tools/extension/transition';
import { ModalNavPage } from '../../../0.base/modal-nav.page';

@IonicPage()
@Component({
    selector: 'manage-wallet',
    templateUrl: 'manage-wallet.page.html'
})
export class ManageWalletPage {
    @ViewChild(Navbar)
    navBar: Navbar;
    public assets: Array<NWAsset.Item>;

    constructor(public navCtrl: NavController, public logger: LoggerService, private account: AccountService, private modalPage: ModalNavPage) {
        this.assets = new Array<NWAsset.Item>();
        this.init();
    }

    ionViewDidLoad() {
        this.navBar.backButtonClick = () => {
            this.modalPage.dismiss();
        };
    }

    async init(): Promise<void> {
        const inven = new Inventory();
        this.assets.push(...inven.assetItems);
    }

    public onChangeVisibility(asset: NWAsset.Item): void {
        asset.option.isShow = !asset.option.isShow;
    }

    public reorderItems(indexes: any): void {
        const src = this.assets[indexes.from];
        const dest = this.assets[indexes.to];
        const swap = dest.option.order;
        dest.option.order = src.option.order;
        src.option.order = swap;

        this.assets.splice(indexes.from, 1);
        this.assets.splice(indexes.to, 0, src);

        let idx = 0;
        this.assets.forEach(item => {
            if (item.option.isActive) {
                item.option.order = idx++;
            }
        });
    }

    public onClick_addWallets(): void {
        this.navCtrl.push(AddWalletPage, {}, NWTransition.Slide());
    }

    public onClickHideOrShowAsset(asset: any): void {}
}
