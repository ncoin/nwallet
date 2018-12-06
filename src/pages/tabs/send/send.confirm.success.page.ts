import { Component } from '@angular/core';
import { IonicPage, NavParams, NavController, AlertController } from 'ionic-angular';

import { LoggerService } from '../../../services/common/logger/logger.service';
import { ModalNavPage } from '../../base/modal-nav.page';
import { ModalBasePage } from '../../base/modal.page';
import { NWAsset } from '../../../models/nwallet';
import { CurrencyService } from '../../../services/nwallet/currency.service';
import { Debug } from '../../../utils/helper/debug';
import { ChannelService } from '../../../services/nwallet/channel.service';
import { SendPage } from './send.page';

@IonicPage()
@Component({
    selector: 'page-send-confirm-success',
    templateUrl: 'send.confirm.success.page.html'
})
export class SendConfirmSuccessPage {
    public amount: number;
    public asset: NWAsset.Item;
    public recipientAddress: string;
    constructor(private navCtrl: NavController, private navParams: NavParams, private logger: LoggerService,  private channel: ChannelService, private parent: ModalNavPage) {
        this.amount = navParams.get('amount');
        this.asset = navParams.get('asset');
        this.recipientAddress = navParams.get('recipientAddress');
    }

    public ionViewCanEnter(): Promise<boolean> {
        return this.channel.sendAsset(this.asset.getWalletId(), this.recipientAddress, this.amount);
    }

    public ionViewDidLoad() {
        setTimeout(() => {
            this.parent.close();
        }, 3000);
    }
}
