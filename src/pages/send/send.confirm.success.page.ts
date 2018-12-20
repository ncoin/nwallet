import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Component } from '@angular/core';
import { NWAsset } from '../../models/nwallet';
import { LoggerService } from '../../services/common/logger/logger.service';
import { ChannelService } from '../../services/nwallet/channel.service';
import { ModalNavPage } from '../base/modal-nav.page';

@IonicPage()
@Component({
    selector: 'page-send-confirm-success',
    templateUrl: 'send.confirm.success.page.html'
})
export class SendConfirmSuccessPage {
    public amount: number;
    public asset: NWAsset.Item;
    public recipientAddress: string;
    constructor(private navCtrl: NavController, private navParams: NavParams, private logger: LoggerService, private channel: ChannelService, private parent: ModalNavPage) {
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
