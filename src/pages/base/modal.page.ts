import { LoggerService } from './../../services/common/logger/logger.service';
import { Navbar, NavController } from 'ionic-angular';
import { ViewChild, Component } from '@angular/core';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { Newable, ModalNavPage } from './modal-nav.page';
import { ModalParameter } from './modal.parameter';
export abstract class ModalBasePage {
    @ViewChild(Navbar)
    public navBar: Navbar;
    public params: ModalParameter;

    public constructor(protected navCtrl: NavController, params: NavParams, protected parent: ModalNavPage) {
        this.params = params.data;
    }

    ionViewDidLoad() {
        if (this.params.canBack) {
            this.navBar.backButtonClick = () => {
                this.parent.close();
            };
        }
    }
}
