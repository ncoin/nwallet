import { ViewChild, Component } from '@angular/core';
import { Navbar, ViewController } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { Newable, ModalNavPage } from './modal-nav.page';

@Component({
    styleUrls: ['modal.page.scss']
})
export abstract class ModalBasePage {
    @ViewChild(Navbar)
    public navBar: Navbar;
    public canBack = true;
    public canClose = true;
    public headerType: 'none' | 'bar' = 'none';
    public navType: 'modal' | 'nav' = 'modal';
    protected constructor(protected navCtrl: NavController, protected params: NavParams, private parent: ModalNavPage) {
        Object.assign(this, params.data);
    }

    ionViewDidLoad() {
        if (this.canBack) {
            this.navBar.backButtonClick = () => {
                this.parent.dismiss();
            };
        }
    }
}
