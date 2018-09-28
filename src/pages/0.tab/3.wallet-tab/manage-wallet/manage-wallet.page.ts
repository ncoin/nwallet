import { ModalPageBase } from './../../../0.base/modal.page';
import { ViewChild } from '@angular/core';
import { Component } from '@angular/core';
import { NavController, ModalController, LoadingController, Loading, IonicPage } from 'ionic-angular';
import { LoggerService } from '../../../../providers/common/logger/logger.service';
import { AccountService } from '../../../../providers/account/account.service';
import { Navbar } from 'ionic-angular/umd/navigation/nav-interfaces';

@IonicPage()
@Component({
    selector: 'manage-wallet',
    templateUrl: 'manage-wallet.page.html',
})
export class ManageWalletPage extends ModalPageBase {

    public dd = false;
    constructor(public navCtrl: NavController, public logger: LoggerService, private account: AccountService) {
        super(navCtrl, logger);
        this.init();
    }

    ionViewDidLoad() {
        super.ionViewDidLoad();
    }

    ionViewDidLeave() {}

    async init(): Promise<void> {}

    public onClickHideOrShowAsset(asset: any): void {}
}
