import { Component } from '@angular/core';
import { IonicPage, NavParams, NavController, AlertController } from 'ionic-angular';

import { LoggerService } from '../../../providers/common/logger/logger.service';
import { ModalNavPage } from '../../0.base/modal-nav.page';
import { ModalBasePage } from '../../0.base/modal.page';
import { NWAsset } from '../../../models/nwallet';
import { CurrencyService } from '../../../providers/nsus/currency.service';
import { Debug } from '../../../utils/helper/debug';
import { TranslateService } from '@ngx-translate/core';
import { NsusChannelService } from '../../../providers/nsus/nsus-channel.service';

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
export class SendConfirmPage extends ModalBasePage {
    public canBack: boolean;
    public asset: NWAsset.Item;
    public recipientAddress: string;

    private _sendAssetAmount = 0.0;
    public sendUSDAmount = 0.0;

    public set sendAssetAmount(input: number) {
        this._sendAssetAmount = input;
        this.sendUSDAmount = input * this.currency.getPrice(this.asset.getCurrencyId());
    }

    public get sendAssetAmount(): number {
        return this._sendAssetAmount;
    }

    constructor(
        navCtrl: NavController,
        navParam: NavParams,
        parent: ModalNavPage,
        private alert: AlertController,
        private logger: LoggerService,
        private currency: CurrencyService,
        private translate: TranslateService,
        private channel: NsusChannelService
    ) {
        super(navCtrl, navParam, parent);
        this.asset = navParam.get('asset');
        this.recipientAddress = navParam.get('recipientAddress');
        Debug.assert(this.asset);
        this.logger.debug('[send-confirm-page] send asset: ', this.asset);
    }

    public onClick_Max(): void {
        this.sendAssetAmount = this.asset.getAmount();
    }

    public async onClick_Next(): Promise<void> {
        const langs = this.translate.instant(['SendConfirmation', 'Amount', 'TransactionFee', 'RecipientAddress', 'Cancel', 'Confirm']);
        const fee = await this.channel.getSendAssetFee(this.asset.getWalletId());

        const sendConfirm = this.alert.create({
            enableBackdropDismiss: true,
            title: langs['SendConfirmation'],
            cssClass: 'alert-base title-underline button-center alert-send-confirm',
            message: messageTemplate(this.asset.getSymbol(), this.sendAssetAmount, fee, this.recipientAddress, langs),
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
                        await this.channel.sendAsset(this.asset.getWalletId(), this.recipientAddress, this.sendAssetAmount);
                        // this.navCtrl.push()
                    },
                    cssClass: 'button-ok'
                }
            ]
        });

        await sendConfirm.present();
    }
}
