import { NgModule } from '@angular/core';
import { AssetFormatPipe } from './asset/asset-format';
import { AssetToUSDPipe } from './asset/asset-to-usd';
import { AssetNamePipe } from './asset/asset-name';
import { StringToDatePipe } from './date/string-to-date';
@NgModule({
    declarations: [AssetToUSDPipe, AssetNamePipe, AssetFormatPipe, StringToDatePipe],
    imports: [],
    exports: [AssetToUSDPipe, AssetNamePipe, AssetFormatPipe, StringToDatePipe],
})
export class NWalletPipesModule {}
