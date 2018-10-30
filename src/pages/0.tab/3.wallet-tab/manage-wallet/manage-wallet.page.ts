import { Component, OnDestroy } from '@angular/core';
import { NavController, ModalController, LoadingController, Loading, IonicPage, Navbar, NavParams } from 'ionic-angular';
import { LoggerService } from '../../../../providers/common/logger/logger.service';
import { AccountService } from '../../../../providers/account/account.service';
import { NWAsset, NWAccount } from '../../../../models/nwallet';
import { AddWalletPage } from '../add-wallet/add-wallet.page';
import { NWTransition } from '../../../../tools/extension/transition';
import { ModalNavPage } from '../../../0.base/modal-nav.page';
import { ModalBasePage } from '../../../0.base/modal.page';
import { Subscription } from 'rxjs';
import { NsusChannelService } from '../../../../providers/nsus/nsus-channel.service';

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
        private channel: NsusChannelService
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

    public onChangeVisibility(asset: NWAsset.Item): void {
        asset.option.isShow = !asset.option.isShow;
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
