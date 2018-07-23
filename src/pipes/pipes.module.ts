import { NgModule } from '@angular/core';
import { AssetFormatPipe } from './asset/asset-format';
import { AssetToUSDPipe } from './asset/asset-to-usd';
import { AssetNamePipe } from './asset/asset-name';
@NgModule({
    declarations: [AssetToUSDPipe, AssetNamePipe, AssetFormatPipe],
    imports: [],
    exports: [AssetToUSDPipe, AssetNamePipe, AssetFormatPipe],
})
export class NWalletPipesModule {}
