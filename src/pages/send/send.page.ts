import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { Component, ViewEncapsulation, OnDestroy, OnInit } from '@angular/core';
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
import { Subscription } from 'rxjs';
import { CurrencyService } from '../../services/nwallet/currency.service';

@IonicPage()
@Component({
    selector: 'page-send',
    templateUrl: 'send.page.html'
})
export class SendPage extends ModalBasePage implements OnInit, OnDestroy {
    private subscriptions: Subscription[] = [];

    public usdFormat = true;
    public recipientAddress = '';
    public selectedWallet: NWAsset.Item;
    public wallets: NWAsset.Item[];
    public priceAmount = 0;
    public walletAmount = 0;

    public get sendAmount(): number {
        return this.usdFormat ? this.priceAmount : this.walletAmount;
    }

    public set sendAmount(value: number) {
        const targetPrice = this.currency.getPrice(this.selectedWallet.getCurrencyId());
        if (this.usdFormat) {
            this.priceAmount = value;
            this.walletAmount = value / targetPrice;
        } else {
            this.priceAmount = value * targetPrice;
            this.walletAmount = value;
        }
    }

    constructor(
        navCtrl: NavController,
        navParam: NavParams,
        parent: ModalNavPage,
        private modalCtrl: ModalController,
        private logger: LoggerService,
        private account: AccountService,
        private popup: PopupService,
        private currency: CurrencyService
    ) {
        super(navCtrl, navParam, parent);
        this.selectedWallet = navParam.get('selectedWallet');
    }

    ngOnInit() {
        this.account.registerSubjects(stream => this.subscriptions.push(stream.walletChanged(this.onWalletChanged())));
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    public onWalletChanged() {
        return (wallets: NWAsset.Item[]) => {
            if (wallets.length > 0) {
                this.logger.debug('[send-page] on refresh assets');
                this.wallets = wallets.slice();
            }
        };
    }

    public onClick_SwapFormat() {
        this.usdFormat = !this.usdFormat;
    }

    public async onClick_Wallet(): Promise<void> {
        const target = await this.popup.selectWallet(this.selectedWallet, this.wallets);
        if (target) {
            this.selectedWallet = target;
            this.sendAmount = this.sendAmount;
        }
    }

    public async onClick_Next(): Promise<void> {
        this.navCtrl.push(SendConfirmPage, {
            wallet: this.selectedWallet,
            walletAmount: this.walletAmount,
            priceAmount: this.priceAmount,
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
