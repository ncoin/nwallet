import { Component } from '@angular/core';
import { NavController, NavOptions, ModalController } from 'ionic-angular';
import { VerifyPhonePage } from '../verify-phone/verify-phone.page';
import { NWTransition } from '../../tools/extension/transition';
import { ModalNavPage } from '../0.base/modal-nav.page';
import { EventService } from '../../providers/common/event/event';
import { NWEvent } from '../../interfaces/events';
@Component({
    selector: 'page-entrance',
    templateUrl: 'entrance.page.html'
})
/**
 * create account
 */
export class EntrancePage {
    constructor(private nav: NavController, private modalCtrl: ModalController, private event: EventService) {}
    public async onContinue(): Promise<void> {
        const isLogin = true;
        if (!isLogin) {
            this.event.publish(NWEvent.App.user_login);
        } else {
            const modal = this.modalCtrl.create(
                ModalNavPage,
                ModalNavPage.resolveModal(VerifyPhonePage, param => {
                    param.canBack = true;
                    param.headerType = 'none';
                    param.phoneNumber = '1234';
                })
            );
            await modal.present();
        }
    }
}
