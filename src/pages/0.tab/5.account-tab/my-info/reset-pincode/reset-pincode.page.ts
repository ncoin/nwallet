import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Navbar, NavParams } from 'ionic-angular';
import { AccountService } from '../../../../../providers/account/account.service';
import { ModalBasePage } from '../../../../0.base/modal.page';
import { ModalNavPage } from '../../../../0.base/modal-nav.page';

@IonicPage()
@Component({
    selector: 'page-reset-pincode',
    templateUrl: 'reset-pincode.page.html'
})
export class ResetPincodePage extends ModalBasePage {
    public pinCode = [];
    public phoneNumber: string;
    public constructor(navCtrl: NavController, navParams: NavParams, parent: ModalNavPage, private account: AccountService) {
        super(navCtrl, navParams, parent);
        this.init();
    }

    private init(): void {}

    ionViewDidLoad() {
        this.navBar.backButtonClick = ev => {
            this.navCtrl.pop({
                animate: false
            });
        };
    }

    public onClick_Next(): void {}

    public onInput(input: any): void {
        if (input === 'delete') {
            this.pinCode.pop();
            return;
        }

        if (this.pinCode.length > 6) {
            return;
        }

        this.pinCode.push(input);
    }
}
