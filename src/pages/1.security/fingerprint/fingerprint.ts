import { FingerprintAIO } from '@ionic-native/fingerprint-aio';
import { Component } from '@angular/core';
import { Platform, NavController } from 'ionic-angular';
import { Logger } from '../../../providers/common/logger/logger';

// fingerprint, pin both
@Component({
    selector: 'page-fingerprint',
    templateUrl: 'fingerprint.html',
})
export class FingerprintModalPage {
    public unregister: Function;
    public isFingerprintAvailable: boolean;

    constructor(private fingerprint: FingerprintAIO, private platform: Platform, private navCtrl: NavController, private logger: Logger) {
        this.unregister = this.platform.registerBackButtonAction(() => {});
        this.checkFingerprint();
    }

    public checkFingerprint(): void {
        this.fingerprint.isAvailable().then(
            async (isAvailable) => {
                this.isFingerprintAvailable = true;
                this.logger.debug('isAvailable', isAvailable);
                const result = await this.fingerprint
                    .show({
                        clientId: 'NWallet',
                        clientSecret: 'password',
                    })
                    .catch(error => {
                        this.logger.info('auth failed', error);
                        return false;
                    });

                if (result) {
                    this.navCtrl.pop({ animate: true });
                }
            },
            (error) => {
                this.isFingerprintAvailable = false;
                this.logger.error('fingerprint unvailalbe, ', error);
            },
        );
    }
}
