import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, LoadingController } from 'ionic-angular';
import { ModalBasePage } from '../../../../../0.base/modal.page';
import { ModalNavPage } from '../../../../../0.base/modal-nav.page';
import { LoggerService } from '../../../../../../providers/common/logger/logger.service';
import { InternationalPhoneComponent } from '../../../../../../components/popovers/international-phone/international-phone';

// todo [important] Guard impl!!
@IonicPage()
@Component({
    selector: 'page-verify-reset-phone-number',
    templateUrl: 'verify-reset-phone-number.html'
})
export class VerifyResetPhoneNumberPage extends ModalBasePage {
    public countryCode = '';
    public phoneNumber = '';
    public selectedCountry: { country: string; code: string };

    constructor(
        navCtrl: NavController,
        navParams: NavParams,
        parent: ModalNavPage,
        private popover: PopoverController,
        protected logger: LoggerService,
        private loading: LoadingController,
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

        // await this.navCtrl.push(VerifySuccessPage, {
        //     phoneNumber: this.selectedCountry.code + this.phoneNumber
        // });
    }
}


