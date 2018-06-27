import { FingerprintModalPage } from './../../../pages/1.security/fingerprint/fingerprint';
import { Injectable } from '@angular/core';
import { ModalController, ModalOptions } from 'ionic-angular';
import { Logger } from '../logger/logger';

@Injectable()
export class LockProvider {
    public isModalProcessing: Boolean;
    constructor(private logger: Logger, private modalController: ModalController) {}

    public tryLockModalOpen(): void {
        if (this.isModalProcessing) {
            this.logger.info('secure phase already processing');
            return;
        }

        this.processFingerprintSecure();
    }

    private async processFingerprintSecure(): Promise<void> {
        this.isModalProcessing = true;

        const modal = this.modalController.create(FingerprintModalPage, {}, <ModalOptions>{ cssClass: 'fullscreen-modal' });

        modal.onDidDismiss(() => {
            this.isModalProcessing = false;
        });
        await modal.present();
    }
}
