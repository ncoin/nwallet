import { Component } from '@angular/core';
import { IonicPage, NavParams, NavController, AlertController, LoadingController } from 'ionic-angular';

import { SendConfirmPinPage } from './send.confirm.pin.page';
import { ModalBasePage } from '../base/modal.page';
import { NWAsset } from '../../models/nwallet';
import { ModalNavPage } from '../base/modal-nav.page';
import { LoggerService } from '../../services/common/logger/logger.service';
import { CurrencyService } from '../../services/nwallet/currency.service';
import { TranslateService } from '@ngx-translate/core';
import { ChannelService } from '../../services/nwallet/channel.service';
import { Debug } from '../../utils/helper/debug';

const messageTemplate = (symbol: string, amount: number, fee: number, address: string, lang: any): string => {
    return `
    <div>
        <div>
            <div>
                ${lang['Amount']}
            </div>
            <div>
                ${amount} ${symbol}
            </div>
        </div>
        <div>
            (123 USD)
        </div>
        <div>
            <div>
                ${lang['TransactionFee']}
            </div>
            <div>
                ${fee} ${symbol}
            </div>
        </div>
        <div>
            <div>
                ${lang['RecipientAddress']}
            </div>
            <div>
                ${address};
            </div>
        </div>
    </div>
    `;
};
@IonicPage()
@Component({
    selector: 'page-send-confirm',
    templateUrl: 'send.confirm.page.html'
})
export class SendConfirmPage {
    public canBack: boolean;
    public wallet: NWAsset.Item;
    public recipientAddress: string;

    private _sendWalletAmount = 0.0;
    public sendUSDAmount = 0.0;

    public set sendWalletAmount(input: number) {
        this._sendWalletAmount = input;
        this.sendUSDAmount = input * this.currency.getPrice(this.wallet.getCurrencyId());
    }

    public get sendWalletAmount(): number {
        return this._sendWalletAmount;
    }

    constructor(
        private navCtrl: NavController,
        private navParam: NavParams,
        private alert: AlertController,
        private logger: LoggerService,
        private currency: CurrencyService,
        private translate: TranslateService,
        private channel: ChannelService
    ) {
        this.wallet = this.navParam.get('wallet');
        this.recipientAddress = this.navParam.get('recipientAddress');
        Debug.assert(this.wallet);
        this.logger.debug('[send-confirm-page] send asset: ', this.wallet);
    }

    public onClick_Max(): void {
        this.sendWalletAmount = this.wallet.getAmount();
    }

    public async onClick_Next(): Promise<void> {
        const langs = this.translate.instant(['SendConfirmation', 'Amount', 'TransactionFee', 'RecipientAddress', 'Cancel', 'Confirm']);
        const fee = await this.channel.getSendAssetFee(this.wallet.getWalletId());

        const sendConfirm = this.alert.create({
            enableBackdropDismiss: true,
            title: langs['SendConfirmation'],
            cssClass: 'alert-base title-underline button-center alert-send-confirm',
            message: messageTemplate(this.wallet.getSymbol(), this.sendWalletAmount, fee, this.recipientAddress, langs),
            buttons: [
                {
                    role: 'cancel',
                    text: langs['Cancel'],
                    handler: () => {},
                    cssClass: 'button-cancel'
                },
                {
                    role: null,
                    text: langs['Confirm'],
                    handler: async () => {
                        this.navCtrl.push(
                            SendConfirmPinPage,
                            {
                                asset: this.wallet,
                                amount: this.sendWalletAmount,
                                recipientAddress: this.recipientAddress
                            },
                            {
                                animate: false
                            }
                        );
                        // this.navCtrl.push()
                    },
                    cssClass: 'button-ok'
                }
            ]
        });

        await sendConfirm.present();
    }
}
