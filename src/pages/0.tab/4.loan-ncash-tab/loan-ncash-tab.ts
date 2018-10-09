import { AppServiceProvider } from '../../../providers/app/app.service';
import { AccountService } from '../../../providers/account/account.service';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar, AlertController, LoadingController, InfiniteScroll, ToastController } from 'ionic-angular';
import { NWallet } from '../../../interfaces/nwallet';
import { LoggerService } from '../../../providers/common/logger/logger.service';
import { createExpr } from 'forge';

@IonicPage()
@Component({
    selector: 'loan-ncash-tab',
    templateUrl: 'loan-ncash-tab.html'
})
export class LoanNcashTabPage {
    public loanStatuses: NWallet.Protocol.LoanStatus[];
    // todo move to collateral provider --sky`
    public collaterals: NWallet.Protocol.Collateral[];
    @ViewChild(Navbar)
    navBar: Navbar;

    private _nchAmount = 0;
    private _wallet: NWallet.AssetContext;
    wallets: NWallet.AssetContext[] = [];
    expectSpendWallet: NWallet.AssetContext;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private account: AccountService,
        private appService: AppServiceProvider,
        private alert: AlertController,
        private loading: LoadingController,
        private logger: LoggerService,
        private toast: ToastController
    ) {
        this.init();
    }

    private async init(): Promise<void> {
        this.loanStatuses = await this.appService.getCurrentLoanStatus();
        this.loanStatuses.push(...this.loanStatuses);
        this.loanStatuses.push(...this.loanStatuses);
        this.collaterals = await this.appService.getCollaterals();
    }

    ionViewDidEnter() {}

    public onClick(): void {
        const t = this.toast.create(
            createExpr(e => {
                e.position = 'middle';
                e.message = '[wallet-loan-page] onclick';
                e.duration = 1000;
            })
        );

        t.present();
    }

    public async doInfinite(infinite: InfiniteScroll): Promise<void> {
        const loanStatuses = await this.appService.getCurrentLoanStatus();
        if (loanStatuses.length < 1) {
            this.logger.debug('[transfer-tab-page] response transfers length =', loanStatuses.length);
            infinite.enable(false);
            return;
        }

        this.loanStatuses.push(...loanStatuses);
        infinite.complete();
    }

    public set nchAmount(value: number) {
        this._nchAmount = value;
        this.calculateTotalNCN();
    }

    public get nchAmount(): number {
        return this._nchAmount;
    }

    public get wallet(): NWallet.AssetContext {
        return this._wallet;
    }

    public set wallet(wallet: NWallet.AssetContext) {
        this._wallet = wallet;
        this.calculateTotalNCN();
    }

    private calculateTotalNCN(): void {
        const totalPrice = (this.nchAmount * 1) / this.wallet.item.price;
        this.expectSpendWallet = <NWallet.AssetContext>{
            amount: totalPrice.toString(),
            item: this._wallet.item,
            price: this.expectSpendWallet.item.price
        };
    }

    async onLoanRequest() {
        const alert = this.alert.create({
            title: 'Loan NCash',
            message: `PAYING : \n ${this._nchAmount} ${this.wallet.item.asset.code}\n` + `<p>LOAN : ${this.expectSpendWallet.amount} ${this.expectSpendWallet.item.asset.code}</p>`,
            buttons: [
                {
                    text: 'CANCEL',
                    handler: () => {}
                },
                {
                    text: 'OK',
                    handler: async () => {
                        const loader = this.loading.create({
                            content: 'please wait ...'
                        });
                        loader.present();
                        // await this.appService.requestLoan(this._wallet.item.asset, Number.parseFloat(this._nchAmount.toString()));
                        // this.navCtrl.popToRoot();
                        loader.dismiss();
                    }
                }
            ]
        });

        alert.present();
    }
}
