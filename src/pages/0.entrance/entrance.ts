import { Component } from '@angular/core';
import { App, NavController } from 'ionic-angular';
import { ConnectProvider } from '../../providers/nsus/connector';

export interface Client {
    username: string;
    password: string;
}

@Component({
    selector: 'entrance',
    templateUrl: 'entrance.html'
})
/**
 * create account
 */
export class EntrancePage {
    public login:Client;
    constructor(private app:App, private nav: NavController, private stellar:ConnectProvider) {

    }

    public onClickCreateAccount(): void {
        this.app; this.nav; this.stellar;
    }
}
