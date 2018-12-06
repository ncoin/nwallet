import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { NWAsset } from '../../../../models/nwallet';
import { ChannelService } from '../../../../services/nwallet/channel.service';
import { LoggerService } from '../../../../services/common/logger/logger.service';

@IonicPage()
@Component({
    selector: 'add-wallet',
    templateUrl: 'add-wallet.page.html'
})
export class AddWalletPage {
    totalPrice: string;
    public _searchText = '';
    public availables: NWAsset.Available[] = [];
    public sourceAvailables: NWAsset.Available[] = [];
    constructor(public navCtrl: NavController, private channel: ChannelService, private logger: LoggerService) {
        this.init();
    }

    public get searchText(): string {
        return this._searchText;
    }

    public set searchText(value: string) {
        this._searchText = value;
        this.onFilterAsset(value);
    }

    private async init(): Promise<void> {
        const availables = await this.channel.getAvailableWallets();
        this.sourceAvailables.push(...availables);
        this.availables = this.sourceAvailables.slice();
    }

    private onFilterAsset(value: string): void {
        if (value && value.trim() !== '') {
            this.availables = this.sourceAvailables.filter(
                item =>
                    item.Symbol.trim()
                        .toLowerCase()
                        .indexOf(value.trim().toLowerCase()) > -1
            );
        } else {
            this.availables = this.sourceAvailables.slice();
        }
    }

    public async onClick_AddAsset(available: NWAsset.Available): Promise<void> {
        const result = await this.channel.createWallet(available);
        if (result) {
            this.sourceAvailables.splice(this.sourceAvailables.indexOf(available), 1);
            this.availables.splice(this.availables.indexOf(available), 1);
        }
    }
}
