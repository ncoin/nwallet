import { LoggerService } from '../../../../providers/common/logger/logger.service';
import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { NWTransaction } from '../../../../models/nwallet';

@IonicPage()
@Component({
    selector: 'wallet-transaction-detail',
    templateUrl: 'wallet-transaction-detail.page.html'
})
export class WalletTransactionDetailPage {
    public transaction: NWTransaction.Item;
    constructor(params: NavParams, private logger: LoggerService, private browser: InAppBrowser) {
        this.transaction = params.get('transaction');
        this.init();
    }

    private async init(): Promise<void> {
        this.logger.debug('[wallet-transaction-page] transaction detail : ', this.transaction);
    }

    public onExploreTransaction(): void {
        // this.transaction;
        // const browser = this.browser.create(`https://stellar.expert/explorer/testnet/tx/${transaction.transaction_hash}`, '_blank', {
        //     location: 'no',
        //     clearcache: 'yes',
        //     footer: 'yes',
        //     toolbar: 'no',
        //     closebuttoncaption: 'done',
        // });
        // browser.insertCSS({
        //     code: 'body { margin-top : 50px;}',
        // });
        // browser.show();
    }
}
