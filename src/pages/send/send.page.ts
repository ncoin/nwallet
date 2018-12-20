import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { Component, ViewEncapsulation } from '@angular/core';
import { ModalBasePage } from '../base/modal.page';
import { NWAsset } from '../../models/nwallet';
import { ModalNavPage } from '../base/modal-nav.page';
import { LoggerService } from '../../services/common/logger/logger.service';
import { AccountService } from '../../services/account/account.service';
import { SendConfirmPage } from './send.confirm.page';
import { QRScanPage } from '../qrscan/qrscan.page';
import { NWModalTransition } from '../../tools/extension/transition';
import { SendConfirmPinPage } from './send.confirm.pin.page';
import { SendConfirmSuccessPage } from './send.confirm.success.page';
import { PopupService } from '../../services/popup/popop.service';

@IonicPage()
@Component({
    selector: 'page-send',
    templateUrl: 'send.page.html',
})
export class SendPage extends ModalBasePage {
    public recipientAddress = '';
    public sendAmount: string;
    public selectedWallet: NWAsset.Item;
    public wallets: NWAsset.Item[];
    constructor(
        navCtrl: NavController,
        navParam: NavParams,
        parent: ModalNavPage,
        private modalCtrl: ModalController,
        private logger: LoggerService,
        private account: AccountService,
        private popup: PopupService
    ) {
        super(navCtrl, navParam, parent);
        this.selectedWallet = navParam.get('selectedWallet');
        this.account.registerSubjects(stream => stream.walletChanged(this.onWalletChanged()));
    }

    public onWalletChanged() {
        return (wallets: NWAsset.Item[]) => {
            if (wallets.length > 0) {
                this.logger.debug('[send-page] on refresh assets');
                this.wallets = wallets.slice();
            }
        };
    }

    public async onClick_Wallet(): Promise<void> {
        const target = await this.popup.selecteWallet(this.selectedWallet, this.wallets);
        if (target) {
            this.selectedWallet = target;
        }
    }

    public async onClick_Next(): Promise<void> {
        this.navCtrl.push(SendConfirmPage, {
            wallet: this.selectedWallet,
            recipientAddress: this.recipientAddress
        });
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
