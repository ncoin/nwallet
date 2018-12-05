import { NgModule } from '@angular/core';
import { AssetFormatPipe } from './asset/asset-format';
import { AssetToUSDPipe } from './asset/asset-to-usd';
import { AssetNamePipe } from './asset/asset-name';
import { StringToDatePipe } from './date/string-to-date';
import { AssetSymbolPipe } from './asset/asset-symbol';
import { CurrencyIdToSymbolPipe } from './currency/currencyId-to-symbol';

const PIPES = [AssetToUSDPipe, AssetNamePipe, AssetFormatPipe, AssetSymbolPipe, StringToDatePipe, CurrencyIdToSymbolPipe];
@NgModule({
    declarations: PIPES,
    imports: [],
    exports: PIPES,
})
export class NWalletPipesModule {}
