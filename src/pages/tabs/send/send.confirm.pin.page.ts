import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Navbar, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { NWAsset } from '../../../models/nwallet';
import { ChannelService } from '../../../services/nwallet/channel.service';
import { LoggerService } from '../../../services/common/logger/logger.service';
import { SendConfirmSuccessPage } from './send.confirm.success.page';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { SendPage } from './send.page';

@IonicPage()
@Component({
    selector: 'page-send-confirm-pin',
    templateUrl: 'send.confirm.pin.page.html'
})
export class SendConfirmPinPage {
    @ViewChild(Navbar)
    navBar: Navbar;
    public pinCode = [];
    public phoneNumber: string;

    public amount: number;
    public asset: NWAsset.Item;
    public recipientAddress: string;

    public constructor(
        private navCtrl: NavController,
        private navParams: NavParams,
        private loading: LoadingController,
        private toast: ToastController,
        private logger: LoggerService
    ) {
        this.amount = navParams.get('amount');
        this.asset = navParams.get('asset');
        this.recipientAddress = navParams.get('recipientAddress');
    }

    ionViewDidLoad() {
        this.navBar.backButtonClick = () => {
            this.navCtrl.pop({
                animate: false
            });
        };


    }

    public async onInput(input: any): Promise<void> {
        if (input === 'delete') {
            this.pinCode.pop();
            return;
        }

        this.pinCode.push(input);

        if (this.pinCode.length > 5) {
            const loading = this.loading.create({
                spinner: 'circles',
                cssClass : 'loading-base',
                dismissOnPageChange: true
            });

            loading.present();

            const result = await this.navCtrl.push(
                SendConfirmSuccessPage,
                {
                    asset: this.asset,
                    amount: this.amount,
                    recipientAddress: this.recipientAddress
                },
                {}
            );
            if (result) {
                this.logger.debug('[send-confirm-pin-page] send confirmed');
            } else {
                loading.dismiss();
                const toast = this.toast.create({
                    message: 'faild to send.',
                    duration: 3000,
                    position : 'middle'
                });

                toast.present();
            }

            this.pinCode.length = 0;
        }
    }
}
