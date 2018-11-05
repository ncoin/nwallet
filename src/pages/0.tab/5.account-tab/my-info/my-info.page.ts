import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Navbar, ModalController } from 'ionic-angular';
import { AccountService } from '../../../../providers/account/account.service';
import { ResetPincodePage } from './reset-pincode/reset-pincode.page';
import { ModalNavPage } from '../../../0.base/modal-nav.page';
import { ResetPhoneNumberPage } from './reset-phone-number/reset-phone-number';
import { LanguagePage } from '../language/language.page';
import { ResetPincodeSuccessPage } from './reset-pincode-success/reset-pincode-success.page';

@IonicPage()
@Component({
    selector: 'my-info',
    templateUrl: 'my-info.page.html'
})
export class MyInfoPage {
    @ViewChild(Navbar)
    navBar: Navbar;
    public email: string;
    public phoneNumber: string;
    public pincodeEnabled: boolean;
    public constructor(private navCtrl: NavController, private account: AccountService, private modal: ModalController) {
        this.init();
    }

    private async init(): Promise<void> {
        const account = await this.account.detail();
        this.email = account.personal.email;
        this.phoneNumber = account.personal.phoneNumber;
        this.pincodeEnabled = account.personal.pincodeEnabled;
    }

    ionViewDidLoad() {
        this.navBar.backButtonClick = ev => {
            this.navCtrl.pop({
                animate: false
            });
        };
    }

    public onClick_Pincode(): void {
        const modal = this.modal.create(
            ModalNavPage,
            ModalNavPage.resolveModal(ResetPincodePage, param => {
                param.canBack = true;
                param.headerType = 'none';
            })
        );

        modal.present();
    }

    public onClick_Phone(): void {
        const modal = this.modal.create(
            ModalNavPage,
            ModalNavPage.resolveModal(ResetPhoneNumberPage, param => {
                param.canBack = true;
                param.headerType = 'none';
            })
        );

        modal.present();
    }
}
export const MY_INFO_PAGES = [MyInfoPage, ResetPhoneNumberPage, LanguagePage, ResetPincodePage, ResetPincodeSuccessPage];

