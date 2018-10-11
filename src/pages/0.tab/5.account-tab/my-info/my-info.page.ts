import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Navbar } from 'ionic-angular';
import { AccountService } from '../../../../providers/account/account.service';

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
    public constructor(private navCtrl: NavController, private account: AccountService) {
        this.init();
    }

    private init(): void {
        this.email = this.account.account_new.personal.email;
        this.phoneNumber = this.account.account_new.personal.phoneNumber;
        this.pincodeEnabled = this.account.account_new.personal.pincodeEnabled;
    }

    ionViewDidLoad() {
        this.navBar.backButtonClick = ev => {
            this.navCtrl.pop({
                animate: false
            });
        };
    }
}
