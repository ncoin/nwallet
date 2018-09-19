import { ImportAccountPage } from '$pages/1.account/importaccount';
import { CreateAccountPage } from '$pages/1.account/createaccount';
import { Component } from '@angular/core';
import { NavController, NavOptions } from 'ionic-angular';

@Component({
    selector: 'entrance',
    templateUrl: 'entrance.html'
})
/**
 * create account
 */
export class EntrancePage {
    constructor(private nav: NavController) {}

    public async onImportAccount(): Promise<void> {
        await this.nav.push(ImportAccountPage, undefined, <NavOptions>{
            animate: true,
            animation: 'wp-transition'
        });
    }

    public async onCreateAccount(): Promise<void> {
        await this.nav.push(CreateAccountPage, undefined, <NavOptions>{
            animate: true,
            animation: 'wp-transition'
        });
    }
}
