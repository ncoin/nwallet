import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, LoadingController } from 'ionic-angular';
import { ModalBasePage } from '../../../../0.base/modal.page';
import { ModalNavPage } from '../../../../0.base/modal-nav.page';
import { LoggerService } from '../../../../../providers/common/logger/logger.service';
import { InternationalPhoneComponent } from '../../../../../components/popovers/international-phone/international-phone';
import { VerifyResetPhoneNumberCodeSentPage } from './1.verify-reset-phone-number-code-sent/verify-reset-phone-number-code-sent.page';
import { VerifyResetPhoneNumberSecuritycodePage } from './2.verify-reset-phone-number-security-code/verify-reset-phone-number-security-code.page';
import { VerfiyResetPhoneNumberSuccessPage } from './3.verfy-reset-phone-number-success/verify-reset-phone-number-success.page';

// todo [important] Guard impl!!
@IonicPage()
@Component({
    selector: 'page-reset-phone-number',
    templateUrl: 'reset-phone-number.page.html'
})
export class ResetPhoneNumberPage extends ModalBasePage {
    public countryCode = '';
    public phoneNumber = '';
    public selectedCountry: { country: string; code: string };

    constructor(
        navCtrl: NavController,
        navParams: NavParams,
        parent: ModalNavPage,
        private popover: PopoverController,
        protected logger: LoggerService,
        private loading: LoadingController
    ) {
        super(navCtrl, navParams, parent);
    }

    public onInput(input: any): void {
        if (input === 'delete') {
            this.phoneNumber = this.phoneNumber.substring(0, this.phoneNumber.length - 1);
        } else {
            this.phoneNumber = this.phoneNumber + input;
        }
    }

    public async onCountryChanged(event: any): Promise<void> {
        const popover = this.popover.create(InternationalPhoneComponent);
        popover.onWillDismiss((data, role) => {
            if (data) {
                this.selectedCountry = data;
            }
        });

        await popover.present({
            ev: event
        });
    }

    public async onClick_Next(): Promise<void> {
        this.logger.debug('[verify-phone-page] phoneNumber : ', this.phoneNumber);

        await this.navCtrl.push(VerifyResetPhoneNumberCodeSentPage, {
            phoneNumber: this.selectedCountry.code + this.phoneNumber
        });
    }
}

export const RESET_PHONE_NUMBER_COMPONENTS = [ResetPhoneNumberPage, VerifyResetPhoneNumberCodeSentPage, VerifyResetPhoneNumberSecuritycodePage, VerfiyResetPhoneNumberSuccessPage];
