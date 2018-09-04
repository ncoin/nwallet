import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { AccountProvider } from '../../../../providers/account/account';
import { Clipboard } from '@ionic-native/clipboard';
/**
 * Generated class for the ReceivePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-receive',
    templateUrl: 'receive.page.html',
})
export class ReceivePage {
    qrData = null;
    createdCode = null;
    scannedCode = null;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private viewCtrl: ViewController,
        account: AccountProvider,
        private clipboard: Clipboard,
        private toast: ToastController
    ) {
        this.qrData = account.getId();
        this.createdCode = account.getId();
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ReceivePage');
    }

    onCreateCode() {
        this.createdCode = this.qrData;
    }

    scanCode() {}

    public onClose(): void {
        this.viewCtrl.dismiss();
    }

    public onTabToCopyClicked(): void {
        this.clipboard
            .copy(this.qrData)
            .then(() => {
                this.toast.create({
                    message: 'copied!',
                    duration: 3000,
                    position: 'middle',
                }).present();
            })
            .catch(err => {
                this.toast.create({
                    message: 'failed to copy!',
                    duration: 3000,
                    position: 'middle',
                }).present();
            });
    }
}
