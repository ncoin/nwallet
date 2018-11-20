import { AccountService } from '../../../providers/account/account.service';
import { QRScanPage } from '../../qrscan/qrscan.page';
import { Component } from '@angular/core';
import { IonicPage, ViewController, ModalController, NavParams, NavController } from 'ionic-angular';

import { QRScanner } from '@ionic-native/qr-scanner';
import { LoggerService } from '../../../providers/common/logger/logger.service';
import { NWModalTransition } from '../../../tools/extension/transition';
import { NWAsset } from '../../../models/nwallet';
import { EventService } from '../../../providers/common/event/event';
import { NWEvent } from '../../../interfaces/events';
import { Debug } from '../../../utils/helper/debug';
import { ModalNavPage } from '../../base/modal-nav.page';
import { SendConfirmPage } from './send.confirm.page';
import { SendConfirmPinPage } from './send.confirm.pin.page';
import { SendConfirmSuccessPage } from './send.confirm.success.page';

@IonicPage()
@Component({
    selector: 'page-send',
    templateUrl: 'send.page.html'
})
export class SendPage {
    public recipientAddress = '';
    public sendAmount = '0';
    public selectedAsset: NWAsset.Item;
    public slides: { assets: NWAsset.Item[] }[] = [];
    constructor(
        private navCtrl: NavController,
        private viewCtrl: ViewController,
        private modalCtrl: ModalController,
        private logger: LoggerService,
        private account: AccountService,
        private event: EventService
    ) {
        this.account.registerSubjects(stream => {
            stream.assetChanged(this.onAssetChanged);
        });

        this.event.RxSubscribe(NWEvent.App.change_tab, context => {
            if (context && context.index === 3) {
                this.onSelectAsset(context.currencyId);
            } else {
                if (this.slides.length > 0) {
                    this.selectedAsset = this.slides[0].assets[0];
                }
            }
        });
    }

    onAssetChanged = (assets: NWAsset.Item[]): void => {
        if (assets.length > 0) {
            const items = assets.slice();
            this.logger.debug('[send-page] on refresh assets');

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
        this.logger.debug('[send-page] currency', targetAsset);
        this.selectedAsset = targetAsset;
    }

    public onClick_Asset(asset: NWAsset.Item): void {
        this.selectedAsset = asset;
    }

    public async onClick_Next(): Promise<void> {
        const modal = this.modalCtrl.create(
            ModalNavPage,
            ModalNavPage.resolveModal(SendConfirmPage, param => {
                param.asset = this.selectedAsset;
                param.recipientAddress = this.recipientAddress;
                param.canBack = true;
                param.headerType = 'bar';
            })
        );

        modal.present();
    }

    public onScanClick(): void {
        // todo [important] Guard impl!!

        const qrCodeModal = this.modalCtrl.create(
            ModalNavPage,
            ModalNavPage.resolveModal(QRScanPage, param => {
                param.canBack = true;
                param.headerType = 'bar';
            }),
            NWModalTransition.Slide()
        );

        qrCodeModal.onDidDismiss((qrCode, role) => {
            this.logger.debug('[send-page] qrscan result', qrCode, role);
            if (qrCode) {
                this.recipientAddress = qrCode;
            } else {
                this.recipientAddress = undefined;
            }
        });

        qrCodeModal.present();
    }
}

export const SEND_PAGES = [SendPage, SendConfirmPage, SendConfirmPinPage, SendConfirmSuccessPage];
