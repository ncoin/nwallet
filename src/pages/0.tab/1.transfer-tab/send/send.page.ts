import { NWallet } from './../../../../interfaces/nwallet';
import { AccountService } from '../../../../providers/account/account.service';
import { QRScanPage } from './../../../qrscan/qrscan.page';
import { Component } from '@angular/core';
import { IonicPage, ViewController, ModalController, NavParams, NavController } from 'ionic-angular';

import { QRScanner } from '@ionic-native/qr-scanner';
import { LoggerService } from '../../../../providers/common/logger/logger.service';
import { NWModalTransition } from '../../../../tools/extension/transition';

@IonicPage()
@Component({
    selector: 'page-send',
    templateUrl: 'send.page.html',
})
export class SendPage {
    public recipientAddress = '';
    public sendAmount = '0';
    public sendAsset: NWallet.AssetContext;
    public availableAssets: NWallet.AssetContext[];
    public canBack: boolean;

    constructor(
        private navCtrl: NavController,
        private viewCtrl: ViewController,
        private modal: ModalController,
        private logger: LoggerService,
        private account: AccountService,
        navParams: NavParams
    ) {
        const asset = navParams.get('asset') as NWallet.AssetContext;
        if (asset) {
            this.availableAssets = [asset];
            this.sendAsset = asset;
        } else {
            this.availableAssets = this.account.getNativeAssets();
            this.sendAsset = this.availableAssets[0];
        }
        // todo fixme --sky
        this.canBack = this.navCtrl['index'] ? false : true;
    }

    public onAssetChanged(): void {
        this.sendAmount = '0';
    }

    public onScanClick(): void {
        // todo [important] Guard impl!!

        const qrCodeModal = this.modal.create(QRScanPage, {}, NWModalTransition.Slide());
        qrCodeModal.onDidDismiss((dismissParam, role) => {
            this.logger.debug('[send-page] qrscan result', dismissParam, role);
            this.recipientAddress = dismissParam.qrCode;
        });

        qrCodeModal.present();
    }

    public onMaxClick(): void {
        this.sendAmount = this.sendAsset.amount;
    }

    public onClose(): void {
        this.viewCtrl.dismiss();
    }
}
