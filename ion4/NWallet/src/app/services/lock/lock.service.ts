import { PinModalPage } from './../../pages/1.security/pin/pin';
import { PlatformService } from './../cores/platform/platform.service';
import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalOptions } from '@ionic/core';
import { LoggerService } from '../cores/logger/logger.service';

@Injectable({
    providedIn: 'root'
})
export class LockService {
    public isModalProcessing: Boolean;
    constructor(private logger: LoggerService, private modalController: ModalController, private platform: PlatformService) {}

    public tryLockModalOpen(): void {
        if (this.isModalProcessing) {
            this.logger.debug('[lock] secure phase already processing');
            return;
        }

        if (!this.isSecurityAvailable()) {
            this.logger.debug('[lock] secure phase not available');
            return;
        }

        this.processFingerprintSecure();
    }

    private isSecurityAvailable(): boolean {
        // todo
        this.logger.debug('[lock] security check', this.platform.isMobile);
        return false;
    }

    private async processFingerprintSecure(): Promise<void> {
        this.isModalProcessing = true;
        const modal = await this.modalController.create(<ModalOptions>{
            component: PinModalPage,
            cssClass: 'fullscreen-modal'
        });
        modal.onDidDismiss(() => {
            this.isModalProcessing = false;
        });

        await modal.present();
    }
}
