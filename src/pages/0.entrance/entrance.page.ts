import { Component } from '@angular/core';
import { NavController, NavOptions, ModalController } from 'ionic-angular';
import { VerifyPhonePage } from '../verify-phone/verify-phone.page';
import { NWTransition } from '../../tools/extension/transition';
import { CreateAccountPage } from '../1.account/createaccount';
import { ModalNavPage } from '../0.base/modal-nav.page';
@Component({
    selector: 'entrance',
    templateUrl: 'entrance.page.html'
})
/**
 * create account
 */
export class EntrancePage {
    constructor(private nav: NavController, private modalCtrl: ModalController) {}
    public async onContinue(): Promise<void> {
        const isLogin = true;
        if (!isLogin) {
            this.nav.push(CreateAccountPage, {}, NWTransition.Slide());
        } else {
            const modal = this.modalCtrl.create(
                ModalNavPage,
                ModalNavPage.resolveModal(VerifyPhonePage, param => {
                    param.canBack = true;
                    param.headerType = 'none';
                })
            );
            await modal.present();

            // const nav = this.nav.push(ModalNavPage, ModalNavPage.resolveNav(VerifyPhonePage, param => {}));
            // await modal.present();
        }
    }
}
