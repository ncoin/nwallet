import { NWallet } from './../../../../interfaces/nwallet';
import { AccountProvider } from './../../../../providers/account/account';
import { QRScanPage } from './../../../qrscan/qrscan.page';
import { Component } from '@angular/core';
import { IonicPage, ViewController,  ModalController } from 'ionic-angular';

import { QRScanner } from '@ionic-native/qr-scanner';
import { Logger } from '../../../../providers/common/logger/logger';
import { NWModalTransition } from '../../../../tools/extension/transition';

@IonicPage()
@Component({
    selector: 'page-send',
    templateUrl: 'send.page.html',
})
export class SendPage {
    public recipientAddress = '';
    public sendAmount = 0;
    public sendAsset: NWallet.AssetContext;
    public availableAssets: NWallet.AssetContext[];

    constructor(private viewCtrl: ViewController, private qrScanner: QRScanner, private modal: ModalController, private logger: Logger, private account: AccountProvider) {
        this.availableAssets = this.account.getNativeAssets();
        this.sendAsset = this.availableAssets[0];
    }

    public onAssetChanged(): void {
        this.sendAsset.amount = '0';
    }

    public onScanClick(): void {
        // todo [important] Guard impl!!
        this.qrScanner
            .prepare()
            .then(status => {
                if (status) {
                    if (status.authorized) {
                        this.logger.debug('[send-page] qrscan status authorized');

                        const qrCodeModal = this.modal.create(QRScanPage, {}, NWModalTransition.Slide());
                        qrCodeModal.onDidDismiss((dismissParam, role) => {
                            this.logger.debug('[send-page] qrscan result', dismissParam, role);
                            this.recipientAddress = dismissParam.data.qrCode;
                        });
                        qrCodeModal.present();
                    } else if (status.denied) {
                        this.logger.debug('[send-page] qrscan status denied');
                        this.qrScanner.openSettings();
                    } else {
                        this.logger.warn('[send-page] qrscan status unknown', status);
                    }
                } else {
                    this.logger.error('[send-page] qrscan status invalid', status);
                }
            })
            .catch(error => {
                this.logger.error('[send-page] qrscan prepare error', error);
            });
    }

    public onClose(): void {
        this.viewCtrl.dismiss();
    }
}
