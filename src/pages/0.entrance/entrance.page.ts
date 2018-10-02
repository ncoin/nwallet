import { Component } from '@angular/core';
import { NavController, NavOptions, ModalController } from 'ionic-angular';
import { VerifyPhonePage } from '../verify-phone/verify-phone.page';
import { NWTransition } from '../../tools/extension/transition';

@Component({
    selector: 'entrance',
    templateUrl: 'entrance.page.html'
})
/**
 * create account
 */
export class EntrancePage {
    constructor(private nav: NavController) {}
    public async onContinue(): Promise<void> {
        this.nav.push(VerifyPhonePage, {}, NWTransition.Slide());
    }
}
