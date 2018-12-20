import { Component, OnDestroy } from '@angular/core';
import { IonicPage, ToastController } from 'ionic-angular';
import { Clipboard } from '@ionic-native/clipboard';
import { AccountService } from '../../../services/account/account.service';
import { LoggerService } from '../../../services/common/logger/logger.service';
import { EventService } from '../../../services/common/event/event.service';
import { NWEvent } from '../../../interfaces/events';

import { Debug } from '../../../utils/helper/debug';
import { NWAsset } from '../../../models/nwallet';
import { PopupService } from '../../../services/popup/popop.service';

@IonicPage()
@Component({
    selector: 'page-receive',
    templateUrl: 'receive.page.html'
})
export class ReceivePage {
    qrData = null;
    scannedCode = null;
    private _selectedAsset: NWAsset.Item;
    public assets: NWAsset.Item[] = [];

    public get selectedAsset(): NWAsset.Item {
        return this._selectedAsset;
    }

    public set selectedAsset(asset: NWAsset.Item) {
        this.qrData = asset.getAddress();
        this._selectedAsset = asset;
    }

    constructor(
        private account: AccountService,
        private clipboard: Clipboard,
        private toast: ToastController,
        private logger: LoggerService,
        private event: EventService,
        private popup: PopupService
    ) {
        this.account.registerSubjects(stream => stream.walletChanged(this.onAssetChanged()));

        this.event.RxSubscribe(NWEvent.App.change_tab, context => {
            if (context && context.index === 0) {
                this.onSelectAsset(context.currencyId);
            } else {
                // reset;
                this.selectedAsset = this.assets[0];
                this.qrData = this.selectedAsset.getAddress();
            }
        });
    }

    public onAssetChanged() {
        return (assets: NWAsset.Item[]) => {
            if (assets.length > 0) {
                this.logger.debug('[receive-page] on refresh assets');
                this.assets = assets.slice();
                if (!this.selectedAsset) {
                    this.selectedAsset = assets[0];
                }
            }
        };
    }

    public async onClick_SelectAsset() {
        const target = await this.popup.selecteWallet(this.selectedAsset, this.assets);
        if (target) {
            this.selectedAsset = target;
            this.qrData = target.getAddress();
        }
    }

    private async onSelectAsset(currencyId: number): Promise<void> {
        const account = await this.account.detail();
        const targetAsset = account.inventory
            .getAssetItems()
            .getValue()
            .find(asset => asset.getCurrencyId() === currencyId);
        Debug.assert(targetAsset);
        this.logger.debug('[receive-page] currency', targetAsset);
        this.qrData = targetAsset.getAddress();
        this.selectedAsset = targetAsset;
    }

    public onClick_Asset(asset: NWAsset.Item): void {
        this.qrData = asset.getAddress();
        this.selectedAsset = asset;
    }

    ionViewWillLeave(): void {
        this.event.publish(NWEvent.App.change_tab);
    }

    public onTabToCopyClicked(): void {
        this.logger.debug('[receive-page] trying copy address : ', this.qrData);
        this.clipboard
            .copy(this.qrData)
            .then(() => {
                this.toast
                    .create({
                        message: 'copied!',
                        duration: 3000,
                        position: 'middle'
                    })
                    .present();
            })
            .catch(err => {
                this.toast
                    .create({
                        message: 'failed to copy!',
                        duration: 3000,
                        position: 'middle'
                    })
                    .present();
            });
    }
}
