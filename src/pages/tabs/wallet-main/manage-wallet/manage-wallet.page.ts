import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController, ModalController, LoadingController, Loading, IonicPage, Navbar, NavParams } from 'ionic-angular';
import { LoggerService } from '../../../../services/common/logger/logger.service';
import { AccountService } from '../../../../services/account/account.service';
import { NWAsset, NWAccount } from '../../../../models/nwallet';
import { AddWalletPage } from '../add-wallet/add-wallet.page';
import { NWTransition } from '../../../../tools/extension/transition';
import { ModalNavPage } from '../../../base/modal-nav.page';
import { ModalBasePage } from '../../../base/modal.page';
import { Subscription } from 'rxjs';
import { ChannelService } from '../../../../services/nwallet/channel.service';
import { NWConstants } from '../../../../models/constants';

@IonicPage()
@Component({
    selector: 'manage-wallet',
    templateUrl: 'manage-wallet.page.html'
})
export class ManageWalletPage extends ModalBasePage implements OnDestroy, OnInit {
    // fixme
    public ncn: NWAsset.Item;

    public assets: NWAsset.Item[];
    private subscriptions: Subscription[] = [];
    constructor(
        public navCtrl: NavController,
        protected navParam: NavParams,
        public logger: LoggerService,
        private account: AccountService,
        parent: ModalNavPage,
        private channel: ChannelService
    ) {
        super(navCtrl, navParam, parent);
        this.assets = new Array<NWAsset.Item>();
    }

    ngOnInit() {
        this.account.registerSubjects(subjects =>
            this.subscriptions.push(
                subjects.walletChanged(assets => {
                    this.ncn = assets.find(asset => asset.getCurrencyId() === NWConstants.NCN.currencyId);
                    this.assets = assets.slice();
                    this.assets.splice(this.assets.indexOf(this.ncn), 1);
                })
            )
        );
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    public async onChangeVisibility(asset: NWAsset.Item): Promise<void> {
        const value = !asset.option.isShow;
        await this.channel.changeWalletVisibility(asset.getWalletId(), value);
    }

    public reorderItems(indexes: any): void {
        const src = this.assets[indexes.from];
        const dest = this.assets[indexes.to];
        const swap = dest.option.order;
        dest.option.order = src.option.order;
        src.option.order = swap;

        this.assets.splice(indexes.from, 1);
        this.assets.splice(indexes.to, 0, src);

        let idx = 0;
        this.assets.forEach(item => {
            if (item.option.isActive) {
                item.option.order = idx++;
            }
        });

        this.channel.changeWalletOrder(this.assets.map(asset => asset.getWalletId()));
    }

    public onClick_addWallets(): void {
        this.navCtrl.push(AddWalletPage, {}, NWTransition.Slide());
    }

    public onClickHideOrShowAsset(asset: any): void {}
}
