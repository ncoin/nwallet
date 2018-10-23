import { LoggerService } from './../../providers/common/logger/logger.service';
import { Navbar, NavController } from 'ionic-angular';
import { ViewChild, Component } from '@angular/core';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { Newable, ModalNavPage } from './modal-nav.page';
import { ModalParameter } from './modal.parameter';

@Component({
    styleUrls: ['modal.page.scss']
})
export abstract class ModalBasePage {
    @ViewChild(Navbar)
    public navBar: Navbar;
    public params: ModalParameter;

    protected constructor(protected navCtrl: NavController, params: NavParams, protected parent: ModalNavPage) {
        this.params = params.data;
    }

    ionViewDidLoad() {
        if (this.params.canBack) {
            this.navBar.backButtonClick = () => this.parent.close();
        }
    }
}
