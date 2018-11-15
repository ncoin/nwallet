import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Navbar, NavParams, ViewController } from 'ionic-angular';
import { LoggerService } from '../../../../../../providers/common/logger/logger.service';
import { NsusChannelService } from '../../../../../../providers/nsus/nsus-channel.service';
import { ModalNavPage } from '../../../../../base/modal-nav.page';
import { AuthorizationService } from '../../../../../../providers/nsus/authorization.service';

@IonicPage()
@Component({
    selector: 'page-verify-reset-phone-number-success',
    templateUrl: 'verify-reset-phone-number-success.page.html'
})
export class VerfiyResetPhoneNumberSuccessPage {
    private currentPin: string;
    private newPin: string;
    constructor(private navParams: NavParams, private logger: LoggerService, private parent: ModalNavPage, private auth: AuthorizationService) {}

    public ionViewCanEnter(): Promise<boolean> {
        return this.auth.resetResetNewMobileNumber('');
    }

    public ionViewDidLoad() {
        setTimeout(() => {
            this.parent.close();
        }, 1000);
    }
}
