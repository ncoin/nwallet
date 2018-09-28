import { LoggerService } from '../../../../providers/common/logger/logger.service';
import { AppConfigProvider } from './../../../../providers/app/app.config';
import { AppServiceProvider } from './../../../../providers/app/app.service';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, ToastController, Navbar } from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'my-info',
    templateUrl: 'my-info.page.html',
})
export class MyInfoPage {
    @ViewChild(Navbar)
    navBar: Navbar;
    public constructor(private navCtrl: NavController) {}
    ionViewDidLoad() {
        this.navBar.backButtonClick = ev => {
            this.navCtrl.pop({
                animate : false
            });
        };
    }
}
