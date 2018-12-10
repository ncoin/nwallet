import { NgModule } from '@angular/core';
import { WalletToFormatPipe } from './wallet/wallet-to-format';
import { WalletToUSDPipe } from './wallet/wallet-to-usd';
import { WalletToFullNamePipe } from './wallet/wallet-to-name';
import { StringToDatePipe } from './date/string-to-date';
import { WalletToSymbolPipe } from './wallet/wallet-to-symbol';
import { CurrencyIdToSymbolPipe } from './currency/currencyId-to-symbol';

const PIPES = [WalletToUSDPipe, WalletToFullNamePipe, WalletToFormatPipe, WalletToSymbolPipe, StringToDatePipe, CurrencyIdToSymbolPipe];
@NgModule({
    declarations: PIPES,
    imports: [],
    exports: PIPES,
})
export class NWalletPipesModule {}
