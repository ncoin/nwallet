import { CreateAccountPage } from './../createaccount/createaccount';
import { WalletPage } from './../0.main/wallet';
import { Component } from '@angular/core';
import { App, NavController, NavOptions } from 'ionic-angular';
import { ConnectProvider } from '../../providers/nsus/connector';
import { AppServiceProvider } from '../../providers/app/app.service';

export interface Client {
    username: string;
    password: string;
}

@Component({
    selector: 'entrance',
    templateUrl: 'entrance.html',
})
/**
 * create account
 */
export class EntrancePage {
    public login: Client;
    constructor(
        private app: App,
        private nav: NavController,
        private stellar: ConnectProvider,
        private appService: AppServiceProvider,
    ) {}

    public onImportAccount(): void {
        this.app;
        this.nav;
        this.stellar;
        this.appService.login;
    }

    public async onCreateAccount(): Promise<void> {
        await this.nav.push(CreateAccountPage, undefined, <NavOptions> {
            animate: true,
            animation : 'wp-transition'
        });
    }
}
