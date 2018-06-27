import { WalletLoanPage } from './wallet-loan/wallet-loan';
import { ViewChild } from '@angular/core';
import { Logger } from './../../providers/common/logger/logger';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar, InfiniteScroll } from 'ionic-angular';
import { NWallet } from '../../interfaces/nwallet';
import { WalletBuyPage } from './wallet-buy/wallet-buy';
import { AppServiceProvider } from '../../providers/app/app.service';
import { InAppBrowser } from '@ionic-native/in-app-browser';

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
    wallet: NWallet.WalletContext;
    histories: NWallet.Transactions.Record[];
    pageToken: string;
    hasNext: boolean;

    @ViewChild(Navbar) navBar: Navbar;
    constructor(public navCtrl: NavController, public navParams: NavParams, private logger: Logger, private appService: AppServiceProvider, private iab: InAppBrowser) {
        this.logger.debug(navParams);
        this.wallet = navParams.get('wallet');
        this.isNCH = this.wallet.item.asset.code === 'NCH' && this.wallet.item.isNative;
        this.loadTransactions();
    }

    async loadTransactions(): Promise<void> {
        await this.getTransactions();
        if (this.hasNext) {
            this.getTransactions();
        }

        this.isLoading = false;
    }

    async getTransactions(): Promise<void> {
        let transaction = await this.appService.getTransactions(this.wallet.item.asset);
        this.pageToken = transaction.pageToken;
        this.hasNext = transaction.hasNext;
        this.histories = transaction.records;
    }

    async doInfinite(infinite: InfiniteScroll) {
        this.logger.debug('aaa');
        if (this.hasNext) {
            await this.getTransactions();
        } else {
            infinite.enable(false);
        }

        infinite.complete();
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

    onExploreTransaction(transactionId: string) {
        const browser = this.iab.create(`https://stellar.expert/explorer/testnet/tx/${transactionId}`, '_blank', {
            location: 'no',
            clearcache: 'yes',
            footer: 'yes',
            toolbar: 'no',
            closebuttoncaption: 'done',
        });

        browser.insertCSS({
            code: 'body { margin-top : 50px;}',
        });

        browser.show();
    }
}
