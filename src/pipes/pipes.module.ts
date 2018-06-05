import { WalletFormatPipe } from './wallet-format/wallet-format';
import { NgModule } from '@angular/core';
import { WalletToUSDPipe } from './wallet-to-usd/wallet-to-usd';
import { WalletNamePipe } from './wallet-name/wallet-name';
@NgModule({
    declarations: [WalletToUSDPipe, WalletNamePipe, WalletFormatPipe],
    imports: [],
    exports: [WalletToUSDPipe, WalletNamePipe, WalletFormatPipe],
})
export class PipesModule {}
