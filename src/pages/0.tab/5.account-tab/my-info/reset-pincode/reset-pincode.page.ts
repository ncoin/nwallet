import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Navbar, NavParams } from 'ionic-angular';
import { AccountService } from '../../../../../providers/account/account.service';
import { ModalBasePage } from '../../../../0.base/modal.page';
import { ModalNavPage } from '../../../../0.base/modal-nav.page';
import { ResetPincodeSuccessPage } from '../reset-pincode-success/reset-pincode-success.page';

@IonicPage()
@Component({
    selector: 'page-reset-pincode',
    templateUrl: 'reset-pincode.page.html'
})
export class ResetPincodePage extends ModalBasePage {
    // todo extract me --sky`
    pinCount = 6;
    private proceedProcess = false;
    private stage: 'current' | 'new pin' | 'reenter new pin';
    public pinCode = '';
    public pinCodeLanguageKey: string;

    private curerntPin: string;
    private newPin: string;
    public constructor(navCtrl: NavController, navParams: NavParams, protected parent: ModalNavPage, private account: AccountService) {
        super(navCtrl, navParams, parent);
        this.init();
    }

    private init(): void {
        this.stage = 'current';
        this.pinCodeLanguageKey = 'EnterCurrentPin';
    }

    public onInput(input: any): void {
        if (input === 'delete') {
            this.pinCode = this.pinCode.substring(0, this.pinCode.length - 1);
            return;
        }

        if (this.proceedProcess) {
            return;
        }

        this.pinCode = this.pinCode + input;
        this.onProcess();
    }

    public async onProcess(): Promise<void> {
        if (this.pinCode.length < 6) {
            return;
        }

        this.proceedProcess = true;

        if (this.stage === 'current') {
            this.curerntPin = this.pinCode;
            this.pinCode = '';
            this.stage = 'new pin';
            this.pinCodeLanguageKey = 'EnterNewPin';
            this.proceedProcess = false;
            return;
        }

        if (this.stage === 'new pin') {
            this.newPin = this.pinCode;
            this.pinCode = '';
            this.stage = 'reenter new pin';
            this.pinCodeLanguageKey = 'ReEnterNewPin';
            this.proceedProcess = false;

            return;
        }

        if (this.stage === 'reenter new pin') {
            if (this.newPin !== this.pinCode) {
                this.pinCode = '';
                this.proceedProcess = false;
                return;
            }

            const result = await this.navCtrl.push(ResetPincodeSuccessPage);
            if (result === false) {
                this.pinCode = '';
                this.proceedProcess = false;
            }
        }
    }
}
