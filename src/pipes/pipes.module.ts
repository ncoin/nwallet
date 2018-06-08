import { NgModule } from '@angular/core';
import { WalletFormatPipe } from './wallet/wallet-format';
import { WalletToUSDPipe } from './wallet/wallet-to-usd';
import { WalletNamePipe } from './wallet/wallet-name';
@NgModule({
    declarations: [WalletToUSDPipe, WalletNamePipe, WalletFormatPipe],
    imports: [],
    exports: [WalletToUSDPipe, WalletNamePipe, WalletFormatPipe],
})
export class PipesModule {}
