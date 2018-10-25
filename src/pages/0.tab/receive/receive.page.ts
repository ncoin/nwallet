import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { Clipboard } from '@ionic-native/clipboard';
import { AccountService } from '../../../providers/account/account.service';
import { LoggerService } from '../../../providers/common/logger/logger.service';
import { EventService } from '../../../providers/common/event/event';
import { NWEvent } from '../../../interfaces/events';

import { Debug } from '../../../utils/helper/debug';
import { NWAsset } from '../../../models/nwallet';

@IonicPage()
@Component({
    selector: 'page-receive',
    templateUrl: 'receive.page.html'
})
export class ReceivePage {
    qrData = null;
    scannedCode = null;
    public selectedAsset: NWAsset.Item;
    public slides: { assets: NWAsset.Item[] }[] = [];
    constructor(private account: AccountService, private clipboard: Clipboard, private toast: ToastController, private logger: LoggerService, private event: EventService) {
        this.account.registerSubjects(stream => {
            stream.assetChanged(this.onAssetChanged);
        });

        this.event.RxSubscribe(NWEvent.App.change_tab, context => {
            if (context) {
                this.onSelectAsset(context.currencyId);
            } else {
                this.selectedAsset = this.slides[0].assets[0];
                this.qrData = this.selectedAsset.getAddress();
            }
        });
    }

    onAssetChanged = (assets: NWAsset.Item[]): void => {
        if (assets.length > 0) {
            const items = assets.slice();
            this.logger.debug('[receive-page] on refresh assets');

            this.slides.length = 0;
            let sliceWallet = items.splice(0, 3);

            while (sliceWallet.length > 0) {
                this.slides.push({ assets: sliceWallet });
                sliceWallet = items.splice(0, 3);
            }
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

    ionViewWillLeave(): void {
        this.event.publish(NWEvent.App.change_tab);
    }

    public onTabToCopyClicked(): void {
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

    public onClick_Asset(asset: NWAsset.Item): void {
        this.qrData = asset.getAddress();
        this.selectedAsset = asset;
    }
}
