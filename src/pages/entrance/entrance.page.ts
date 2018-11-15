import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { VerifyPhonePage } from './verify-phone/verify-phone.page';
import { ModalNavPage } from '../base/modal-nav.page';
@Component({
    selector: 'page-entrance',
    templateUrl: 'entrance.page.html'
})
/**
 * create account
 */
export class EntrancePage {
    constructor(private modalCtrl: ModalController) {}
    public async onContinue(): Promise<void> {
        const modal = this.modalCtrl.create(
            ModalNavPage,
            ModalNavPage.resolveModal(VerifyPhonePage, param => {
                param.canBack = true;
                param.headerType = 'none';
            })
        );
        await modal.present();
    }
}
