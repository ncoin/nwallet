import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { Logger } from '../../providers/common/logger/logger';

// todo [important] Guard impl!!
@IonicPage()
@Component({
    selector: 'page-qrscan',
    templateUrl: 'qrscan.page.html',
})
export class QRScanPage {
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private viewCtrl: ViewController,
        private toast: ToastController,
        private qrScanner: QRScanner,
        private logger: Logger
    ) {
        this.init();
    }

    private init(): void {
        this.logger.debug('[qrscan-page] camera open');

        const subscription = this.qrScanner.scan().subscribe(data => {
            this.logger.debug('qrdata', data);
            this.qrScanner.hide();
            this.onClose(data);
            subscription.unsubscribe();
        });

        this.qrScanner.show();
        this.toast.create({ message: 'scan qrcode', duration: 3000, position: 'bottom' }).present();
    }

    ionViewWillEnter() {
        this.showCamera();
    }

    ionViewWillLeave() {
        this.hideCamera();
    }

    public onClose(data: any): void {
        this.viewCtrl.dismiss({
            qrCode: data,
        });
    }

    private showCamera(): void {
        (window.document.querySelector('ion-app') as HTMLElement).classList.add('cameraView');
    }

    private hideCamera(): void {
        (window.document.querySelector('ion-app') as HTMLElement).classList.remove('cameraView');
    }
}
