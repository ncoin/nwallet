import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { LoggerService } from '../../providers/common/logger/logger.service';
import { ModalBasePage } from '../0.base/modal.page';
import { ModalNavPage } from '../0.base/modal-nav.page';
import { PlatformService } from '../../providers/common/platform/platform.service';

// todo [important] Guard impl!!
@IonicPage()
@Component({
    selector: 'page-qrscan',
    templateUrl: 'qrscan.page.html'
})
export class QRScanPage extends ModalBasePage {
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        protected parent: ModalNavPage,
        private toast: ToastController,
        private qrScanner: QRScanner,
        private logger: LoggerService,
        private platform: PlatformService
    ) {
        super(navCtrl, navParams, parent);
        this.init();
    }

    ionViewDidLoad() {
        if (this.params.canBack) {
            this.navBar.backButtonClick = () => this.onClose(undefined);
        }
    }

    private init(): void {
        this.logger.debug('[qrscan-page] camera open');

        this.qrScanner
            .prepare()
            .then(status => {
                if (status) {
                    if (status.authorized) {
                        this.logger.debug('[send-page] qrscan status authorized');
                        this.qrScanner.show();

                        const subscription = this.qrScanner.scan().subscribe(data => {
                            this.logger.debug('qrdata', data);
                            subscription.unsubscribe();
                            this.onClose(data);
                        });
                    } else if (status.denied) {
                        this.logger.debug('[send-page] qrscan status denied');
                        this.qrScanner.openSettings();
                    } else {
                        this.logger.warn('[send-page] qrscan status unknown', status);
                    }
                } else {
                    this.logger.error('[send-page] qrscan status invalid', status);
                }
            })
            .catch(error => {
                this.logger.error('[send-page] qrscan prepare error', error);
            });

        this.toast.create({ message: 'scan qrcode', duration: 3000, position: 'bottom' }).present();
    }

    ionViewWillEnter() {
        this.showCamera();
    }

    ionViewWillLeave() {
        this.hideCamera();
    }

    ionViewDidLeave() {
        this.qrScanner.hide();
        this.qrScanner.destroy();
    }

    public onClose(data: any): void {
        this.hideCamera();
        this.qrScanner.hide();
        this.qrScanner.destroy();

        this.parent.dismiss(data);
    }

    private showCamera(): void {
        (window.document.querySelector('ion-app') as HTMLElement).classList.add('cameraView');
    }

    private hideCamera(): void {
        (window.document.querySelector('ion-app') as HTMLElement).classList.remove('cameraView');
    }
}
