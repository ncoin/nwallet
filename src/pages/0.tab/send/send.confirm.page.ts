import { Component } from '@angular/core';
import { IonicPage, NavParams, NavController, AlertController } from 'ionic-angular';

import { LoggerService } from '../../../providers/common/logger/logger.service';
import { ModalNavPage } from '../../0.base/modal-nav.page';
import { ModalBasePage } from '../../0.base/modal.page';
import { NWAsset } from '../../../models/nwallet';

@IonicPage()
@Component({
    selector: 'page-send-confirm',
    templateUrl: 'send.confirm.page.html'
})
export class SendConfirmPage extends ModalBasePage {

    public canBack: boolean;
    public asset: NWAsset.Item;

    public sendAssetAmount = 0.0;
    public sendUSDAmount = 0.0;


    constructor(navCtrl: NavController, navParam: NavParams, parent: ModalNavPage, private alert: AlertController, private logger: LoggerService) {
        super(navCtrl, navParam, parent);
        this.asset = navParam.get('asset');
    }

    public onMaxClick(): void {
        // this.sendAmount = this.sendAsset.amount;
    }
}
