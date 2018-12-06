import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Navbar, NavParams, ViewController } from 'ionic-angular';
import { ModalNavPage } from '../../../../base/modal-nav.page';
import { LoggerService } from '../../../../../services/common/logger/logger.service';
import { AuthorizationService } from '../../../../../services/nwallet/authorization.service';

@IonicPage()
@Component({
    selector: 'page-reset-pincode-success',
    templateUrl: 'reset-pincode-success.page.html'
})
export class ResetPincodeSuccessPage {
    private currentPin: string;
    private newPin: string;
    constructor(private navParams: NavParams, private logger: LoggerService, private auth: AuthorizationService, private parent: ModalNavPage) {
        this.currentPin = this.navParams.get('currentPin');
        this.newPin = this.navParams.get('newPin');
    }

    public ionViewCanEnter(): Promise<boolean> {
        return this.auth.resetPincode(this.currentPin, this.newPin);
    }

    public ionViewDidLoad() {
        setTimeout(() => {
            this.parent.close();
        }, 1000);
    }
}
