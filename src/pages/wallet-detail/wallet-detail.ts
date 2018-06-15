import { WalletLoanPage } from './wallet-loan/wallet-loan';
import { ViewChild } from '@angular/core';
import { Logger } from './../../providers/common/logger/logger';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar, InfiniteScroll } from 'ionic-angular';
import { NWallet } from '../../interfaces/nwallet';
import { WalletBuyPage } from './wallet-buy/wallet-buy';
import { AppServiceProvider } from '../../providers/app/app.service';

/**
 * Generated class for the WalletDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-wallet-detail',
    templateUrl: 'wallet-detail.html',
})
export class WalletDetailPage {
    isLoading: boolean = true;
    isNCH: boolean;
    wallet: NWallet.WalletItem;
    histories: NWallet.Transaction[];
    transactions: NWallet.TransactionRecord;

    @ViewChild(Navbar) navBar: Navbar;
    constructor(public navCtrl: NavController, public navParams: NavParams, private logger: Logger, private appService: AppServiceProvider) {
        this.logger.debug(navParams);
        this.wallet = navParams.get('wallet');
        this.isNCH = this.wallet.asset.getIssuer() === NWallet.NCH.getIssuer() && this.wallet.asset.getCode() === NWallet.NCH.getCode();
        this.loadTransactions();
    }

    async loadTransactions(): Promise<void> {
        this.transactions = await this.appService.getTransactions(this.wallet);
        this.histories = this.transactions.records();

        await this.transactions.next();
        const records = this.transactions.records();
        if (records && records[0]) {
            records.forEach(record => {
                this.histories.push(record);
            });
        }

        this.isLoading = false;
    }

    async doInfinite(infinite: InfiniteScroll) {
        this.logger.debug('aaa');
        await this.transactions.next();
        const records = this.transactions.records();
        if (records && records[0]) {
            records.forEach(record => {
                this.histories.push(record);
            });
            infinite.complete();
            if (records.length < 2) {
                infinite.enable(false);
            }
        } else {
            infinite.enable(false);
        }
    }

    ionViewDidLoad() {
        //todo extract --sky
        this.navBar.backButtonClick = ev => {
            ev.preventDefault();
            ev.stopPropagation();
            this.navCtrl.pop({
                animate: true,
                animation: 'ios-transition',
            });
        };
    }

    onBuyAsset() {
        this.navCtrl.push(
            WalletBuyPage,
            { wallet: this.wallet },
            {
                animate: true,
                animation: 'ios-transition',
            },
        );
    }

    onLoanAsset() {
        this.navCtrl.push(
            WalletLoanPage,
            { wallet: this.wallet },
            {
                animate: true,
                animation: 'ios-transition',
            },
        );
    }
}