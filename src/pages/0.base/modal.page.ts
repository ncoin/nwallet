import { LoggerService } from './../../providers/common/logger/logger.service';
import { Navbar, NavController } from 'ionic-angular';
import { ViewChild } from '@angular/core';

export abstract class ModalPageBase {
    @ViewChild(Navbar)
    navBar: Navbar;
    protected constructor(protected navCtrl: NavController, protected logger: LoggerService) {

    }

    protected ionViewDidLoad(): void {
        this.navBar.backButtonClick = ev => {
            this.navCtrl.pop({
                animate: false,
            });
        };
    }
}
