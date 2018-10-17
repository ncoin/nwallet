import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { AccountService } from '../../../../providers/account/account.service';
import { Clipboard } from '@ionic-native/clipboard';

@IonicPage()
@Component({
    selector: 'page-receive',
    templateUrl: 'receive.page.html',
})
export class ReceivePage {
    qrData = null;
    createdCode = null;
    scannedCode = null;
    public canGoBack: boolean;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private viewCtrl: ViewController,
        account: AccountService,
        private clipboard: Clipboard,
        private toast: ToastController
    ) {
        // this.qrData = account.getId();
        // this.createdCode = account.getId();
        this.canGoBack = this.navCtrl['index'] ? false : true;
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
                this.toast
                    .create({
                        message: 'copied!',
                        duration: 3000,
                        position: 'middle',
                    })
                    .present();
            })
            .catch(err => {
                this.toast
                    .create({
                        message: 'failed to copy!',
                        duration: 3000,
                        position: 'middle',
                    })
                    .present();
            });
    }
}
