import { PinModalPage } from './../../../pages/1.security/pin/pin';
// import { FingerprintModalPage } from './../../../pages/1.security/fingerprint/fingerprint';
import { Injectable } from '@angular/core';
import { ModalController, ModalOptions } from 'ionic-angular';
import { Logger } from '../logger/logger';
import { PlatformProvider } from '../platform/platform';

@Injectable()
export class LockProvider {
    public isModalProcessing: Boolean;
    constructor(private logger: Logger, private modalController: ModalController, private platform: PlatformProvider) {}

    public tryLockModalOpen(): void {
        if (this.isModalProcessing) {
            this.logger.debug('[lock] secure phase already processing');
            return;
        }

        if (!this.isSecurityAvailable()){
            this.logger.debug('[lock] secure phase not available')
            return;
        }

        this.processFingerprintSecure();
    }

    private isSecurityAvailable(): boolean{

        //todo
        this.logger.debug('[lock] security check',this.platform.isMobile);
        return false;
        // return this.platform.isMobile;
    }

    private async processFingerprintSecure(): Promise<void> {
        this.isModalProcessing = true;

        const modal = this.modalController.create(PinModalPage, {}, <ModalOptions>{ cssClass: 'fullscreen-modal' });

        modal.onDidDismiss(() => {
            this.isModalProcessing = false;
        });
        await modal.present();
    }
}
