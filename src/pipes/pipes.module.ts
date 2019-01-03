import { NgModule } from '@angular/core';
import { WalletToFormatPipe } from './wallet/wallet-to-format';
import { WalletToUSDPipe } from './wallet/wallet-to-usd';
import { WalletToFullNamePipe } from './wallet/wallet-to-name';
import { WalletToSymbolPipe } from './wallet/wallet-to-symbol';
import { WalletPerPricePipe } from './wallet/wallet-per-price';
import { WalletToTotalPricePipe } from './wallet/wallet-to-totalprice.usd';
import { StringToDatePipe } from './date/string-to-date';
import { CurrencyIdToSymbolPipe } from './currency/currencyId-to-symbol';

const PIPES = [
    WalletToUSDPipe,
    WalletPerPricePipe,
    WalletToFullNamePipe,
    WalletToTotalPricePipe,
    WalletToFormatPipe,
    WalletToSymbolPipe,
    StringToDatePipe,
    CurrencyIdToSymbolPipe
];
@NgModule({
    declarations: PIPES,
    imports: [],
    exports: PIPES,
})
export class NWalletPipesModule {}
