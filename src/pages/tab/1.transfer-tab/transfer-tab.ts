import { Component , ViewChild} from '@angular/core';
import { IonicPage, NavController,  Navbar} from 'ionic-angular';


/**
 * Generated class for the WalletDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    templateUrl: 'transfer-tab.html',
})
export class TransferTabPage {

    @ViewChild(Navbar) navBar: Navbar;
    constructor(public navCtrl: NavController){
    }


}
