import { Component } from '@angular/core';
import { IonicPage, NavParams, NavController, AlertController } from 'ionic-angular';

import { LoggerService } from '../../../providers/common/logger/logger.service';
import { ModalNavPage } from '../../0.base/modal-nav.page';
import { ModalBasePage } from '../../0.base/modal.page';
import { NWAsset } from '../../../models/nwallet';
import { CurrencyService } from '../../../providers/nsus/currency.service';
import { Debug } from '../../../utils/helper/debug';

@IonicPage()
@Component({
    selector: 'page-send-confirm-pin',
    templateUrl: 'send.confirm.pin.page.html'
})
export class SendConfirmPinPage {
    public canBack: boolean;
    public asset: NWAsset.Item;

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
        private currency: CurrencyService
    ) {
        super(navCtrl, navParam, parent);
        this.asset = navParam.get('asset');
        Debug.assert(this.asset);
        this.logger.debug('[send-confirm-page] send asset: ', this.asset);
    }

    public onMaxClick(): void {
        this.sendAssetAmount = this.asset.getAmount();
    }
}
