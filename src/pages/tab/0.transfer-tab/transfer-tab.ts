import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the TransferTabPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-transfer-tab',
    templateUrl: 'transfer-tab.html',
})
export class TransferTabPage {
    
    constructor(public navCtrl: NavController, public navParams: NavParams) {}

    ionViewDidLoad() {
        console.log('ionViewDidLoad TransferTabPage');
    }
}
