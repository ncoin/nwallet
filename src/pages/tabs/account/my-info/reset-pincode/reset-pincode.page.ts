import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Navbar, NavParams, ToastController } from 'ionic-angular';
import { AccountService } from '../../../../../services/account/account.service';
import { ModalBasePage } from '../../../../base/modal.page';
import { ModalNavPage } from '../../../../base/modal-nav.page';
import { AuthorizationService } from '../../../../../services/nsus/authorization.service';
import { LoggerService } from '../../../../../services/common/logger/logger.service';
import { ResetPincodeSuccessPage } from '../reset-pincode-success/reset-pincode-success.page';

export type PinPhase = 'EnterYourCurrentPin' | 'EnterYourNewPin' | 'ReEnterYourNewPin';

export interface Phase {
    pin: string[];
    phaseKey: PinPhase;
}
@IonicPage()
@Component({
    selector: 'page-reset-pincode',
    templateUrl: 'reset-pincode.page.html'
})
export class ResetPincodePage extends ModalBasePage {
    private isPinRegistered: boolean;
    public phases: Phase[];
    public index = 0;

    public constructor(
        navCtrl: NavController,
        navParams: NavParams,
        parent: ModalNavPage,
        private logger: LoggerService,
        private account: AccountService,
        private toast: ToastController
    ) {
        super(navCtrl, navParams, parent);
        this.init();
    }

    private async init(): Promise<void> {
        this.phases = [
            {
                phaseKey: 'EnterYourCurrentPin',
                pin: []
            },
            {
                phaseKey: 'EnterYourNewPin',
                pin: []
            },
            {
                phaseKey: 'ReEnterYourNewPin',
                pin: []
            }
        ];

        const account = await this.account.detail();
        this.isPinRegistered = account.personal.pincodeEnabled;
    }

    private get pin(): string[] {
        return this.phases[this.index].pin;
    }

    public onInput(input: any): void {
        if (input === 'delete') {
            this.pin.pop();
            return;
        }

        if (this.pin.length < 6) {
            this.pin.push(input);
            this.checkPhase();
        }
    }

    private async checkPhase(): Promise<void> {
        if (this.pin.length === 6) {
            if (this.index === this.phases.length - 1) {
                let currentPin,
                    newPin,
                    reEnterNewPin = '';
                if (this.isPinRegistered) {
                    currentPin = this.phases[0].pin.reduce((prev, current) => prev + current);
                    newPin = this.phases[1].pin.reduce((prev, current) => prev + current);
                    reEnterNewPin = this.phases[2].pin.reduce((prev, current) => prev + current);
                } else {
                    newPin = this.phases[0].pin.reduce((prev, current) => prev + current);
                    reEnterNewPin = this.phases[1].pin.reduce((prev, current) => prev + current);
                }

                if (newPin === reEnterNewPin) {
                    const result = await this.navCtrl.push(ResetPincodeSuccessPage, { currentPin, newPin });
                } else {
                    this.logger.error('new pin not matched.', newPin, reEnterNewPin);
                    this.toast.create({
                        position: 'middle',
                        message: 'failed',
                        duration: 2000
                    }).present();
                    this.index = 0;
                    this.phases.forEach(p => (p.pin.length = 0));
                }
            } else {
                this.index++;
            }
        }
    }
}
