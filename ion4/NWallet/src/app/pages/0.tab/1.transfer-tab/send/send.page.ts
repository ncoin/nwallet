import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams, NavController } from 'ionic-angular';
import { ModalController } from '@ionic/angular';

import { NWallet } from '$infrastructure/nwallet';
import { LoggerService } from '$services/cores/logger/logger.service';
import { AccountService } from '$services/app/account/account.service';
import { QRScanPage } from '$pages/qrscan/qrscan.page';

@IonicPage()
@Component({
    selector: 'page-send',
    templateUrl: 'send.page.html'
})
export class SendPage {
    public recipientAddress = '';
    public sendAmount = '0';
    public sendAsset: NWallet.AssetContext;
    public availableAssets: NWallet.AssetContext[];
    public canGoBack: boolean;

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
            // this.availableAssets = this.account.getNativeAssets();
            this.sendAsset = this.availableAssets[0];
        }
        // todo fixme --sky
        this.canGoBack = this.navCtrl['index'] ? false : true;
    }

    public onAssetChanged(): void {
        this.sendAmount = '0';
    }

    public async onScanClick(): Promise<void> {
        // todo [important] Guard impl!!
        const qrCodeModal = await this.modal.create({
            component: QRScanPage
        });

        await qrCodeModal.onDidDismiss(dismissParam => {
            this.logger.debug('[send-page] qrscan result', dismissParam);
            this.recipientAddress = dismissParam.data.qrCode;
            return dismissParam.data.qrCode;
        });

        await qrCodeModal.present();
    }

    public onMaxClick(): void {
        this.sendAmount = this.sendAsset.amount;
    }

    public onClose(): void {
        this.viewCtrl.dismiss();
    }
}
