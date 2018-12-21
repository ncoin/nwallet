import { Component, OnInit } from '@angular/core';
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

@IonicPage()
@Component({
    selector: 'page-send-confirm',
    templateUrl: 'send.confirm.page.html'
})
export class SendConfirmPage {
    public canBack: boolean;
    public wallet: NWAsset.Item;
    public walletAmount: number;
    public priceAmount: number;
    public fee: number;
    public recipientAddress: string;

    constructor(private navCtrl: NavController, private navParam: NavParams, private logger: LoggerService, private channel: ChannelService) {
        this.wallet = this.navParam.get('wallet');
        this.recipientAddress = this.navParam.get('recipientAddress');
        this.walletAmount = this.navParam.get('walletAmount');
        this.priceAmount = this.navParam.get('priceAmount');
        this.fee = this.wallet.WithdrawFee;
    }

    public onClick_Cancel(): void {}

    public onClick_Confirm(): void {
        this.navCtrl.push(
            SendConfirmPinPage,
            {
                asset: this.wallet,
                amount: this.walletAmount,
                recipientAddress: this.recipientAddress
            },
            {
                animate: false
            }
        );
    }
}
