import { Component, OnDestroy } from '@angular/core';
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

@IonicPage()
@Component({
    selector: 'manage-wallet',
    templateUrl: 'manage-wallet.page.html'
})
export class ManageWalletPage extends ModalBasePage implements OnDestroy {
    public assets: Array<NWAsset.Item>;
    private isReorderd: boolean;
    private subscriptions: Subscription[] = [];
    private previous: number[] = [];

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
        this.init();
    }

    ionViewWillLeave() {
        if (this.isReorderd) {
            this.account.registerSubjects(account => {});
        }
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    async init(): Promise<void> {
        this.account.registerSubjects(subjects => {
            this.subscriptions.push(
                subjects.assetChanged(assets => {
                    this.assets = assets;
                })
            );
        });
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

        this.isReorderd = true;

        this.channel.changeWalletOrder(this.assets.map(asset => asset.getWalletId()));
    }

    public onClick_addWallets(): void {
        this.navCtrl.push(AddWalletPage, {}, NWTransition.Slide());
    }

    public onClickHideOrShowAsset(asset: any): void {}
}
