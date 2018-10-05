import { LoggerService } from './../../providers/common/logger/logger.service';
import { NavController, ViewController, Navbar, ModalOptions } from 'ionic-angular';
import { Component, ViewChild, ReflectiveInjector } from '@angular/core';
import { IonicPage } from 'ionic-angular/navigation/ionic-page';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { ModalBasePage } from './modal.page';
import { ParameterExpr, createExpr } from 'forge';
import { NavOptions, TransitionDoneFn } from 'ionic-angular/navigation/nav-util';

export interface Newable<T> {
    new (...args: any[]): T;
}

@Component({
    selector: 'page-modal-nav',
    templateUrl: 'modal-nav.page.html'
})
export class ModalNavPage {
    public rootPage: typeof ModalBasePage;

    /** parameter only */
    public params: ModalBasePage;

    public static resolveModal<T extends ModalBasePage>(page: Newable<T>, expr: ParameterExpr<T>): { params: T; page: any; type: string } {
        return {
            params: createExpr(expr),
            page: page,
            type: 'modal',
        };
    }

    public static resolveNav<T extends ModalBasePage>(page: Newable<T>, expr: ParameterExpr<T>): { params: T; page: any; type: string } {
        return {
            params: createExpr(expr),
            page: page,
            type: 'nav'
        };
    }

    public constructor(protected navCtrl: NavController, protected logger: LoggerService, param: NavParams, private viewCtrl: ViewController) {
        this.rootPage = param.get('page');
        this.params = param.get('params');
    }

    public dismiss(data?: any, role?: string, nav?: NavOptions): void {
        this.viewCtrl.dismiss(data, role, nav);
    }

    public back(nav?: NavOptions, done?: TransitionDoneFn): void {
        this.navCtrl.pop(nav, done);
    }
}
