import { ViewChild, Component } from '@angular/core';
import { Navbar, ViewController } from 'ionic-angular';
import { NavController } from 'ionic-angular';
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

    protected constructor(protected navCtrl: NavController, params: NavParams, private parent: ModalNavPage) {
        this.params = params.data;
    }

    ionViewDidLoad() {
        if (this.params.canBack) {
            if (this.params.navType === 'modal') {
                this.navBar.backButtonClick = () => {
                    this.parent.dismiss();
                };
            } else {
                this.navBar.backButtonClick = () => {
                    this.parent.back();
                };
            }
        }
    }
}
