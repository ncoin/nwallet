import { LoggerService } from './../../providers/common/logger/logger.service';
import { NavController, ViewController, Navbar } from 'ionic-angular';
import { Component, ViewChild } from '@angular/core';
import { IonicPage } from 'ionic-angular/navigation/ionic-page';
import { NavParams } from 'ionic-angular/navigation/nav-params';

@IonicPage()
@Component({
    templateUrl: 'modal-nav.page.html',
    selector: 'page-modal-nav'
})
export class ModalNavPage {
    public rootPage: any;
    public params: any = {};
    public constructor(protected navCtrl: NavController, protected logger: LoggerService, private param: NavParams, private viewCtrl: ViewController) {
        this.params = this.param.get('params');
        this.rootPage = this.param.get('page');
    }

    public dismiss(data: any = null): void {
        this.viewCtrl.dismiss(data);
    }
}
