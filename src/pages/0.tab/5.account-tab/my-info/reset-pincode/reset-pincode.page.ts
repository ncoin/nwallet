import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Navbar, NavParams } from 'ionic-angular';
import { AccountService } from '../../../../../providers/account/account.service';
import { ModalBasePage } from '../../../../0.base/modal.page';
import { ModalNavPage } from '../../../../0.base/modal-nav.page';
import { AuthorizationService } from '../../../../../providers/auth/authorization.service';
import { LoggerService } from '../../../../../providers/common/logger/logger.service';
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
    public phases: Phase[];
    public index = 0;

    public constructor(navCtrl: NavController, navParams: NavParams, parent: ModalNavPage, private logger: LoggerService) {
        super(navCtrl, navParams, parent);
        this.init();
    }

    private init(): void {
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
            if (this.index === 2) {
                const currentPin = this.phases[0].pin.reduce((prev, current) => prev + current);
                const newPin = this.phases[1].pin.reduce((prev, current) => prev + current);
                const reEnterNewPin = this.phases[2].pin.reduce((prev, current) => prev + current);
                if (newPin === reEnterNewPin) {
                    const result = await this.navCtrl.push(ResetPincodeSuccessPage, { currentPin, newPin });
                } else {
                    this.logger.error('new pin not matched.', newPin, reEnterNewPin);
                    this.index = 0;
                    this.phases.forEach(p => (p.pin.length = 0));
                }
            } else {
                this.index++;
            }
        }
    }
}
