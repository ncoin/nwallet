import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Navbar, NavParams, ViewController } from 'ionic-angular';
import { AccountService } from '../../../../../providers/account/account.service';
import { ModalBasePage } from '../../../../0.base/modal.page';
import { ModalNavPage } from '../../../../0.base/modal-nav.page';
import { LoggerService } from '../../../../../providers/common/logger/logger.service';
import { NsusChannelService } from '../../../../../providers/nsus/nsus-channel.service';

@IonicPage()
@Component({
    selector: 'page-reset-pincode-success',
    templateUrl: 'reset-pincode-success.page.html'
})
export class ResetPincodeSuccessPage {
    private currentPin: string;
    private newPin: string;
    constructor(private navParams: NavParams, private logger: LoggerService, private channel: NsusChannelService, private parent: ModalNavPage) {}

    public ionViewCanEnter(): Promise<boolean> {
        return this.channel.requestResetPincode('', '');
    }

    public ionViewDidLoad() {
        setTimeout(() => {
            this.parent.dismiss();
        }, 1000);
    }
}
