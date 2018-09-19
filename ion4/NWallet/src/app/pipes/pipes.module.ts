import { NgModule } from '@angular/core';
import { AssetFormatPipe } from './asset/asset-format.pipe';
import { AssetToUSDPipe } from './asset/asset-to-usd.pipe';
import { AssetNamePipe } from './asset/asset-name.pipe';
@NgModule({
    declarations: [AssetToUSDPipe, AssetNamePipe, AssetFormatPipe],
    imports: [],
    exports: [AssetToUSDPipe, AssetNamePipe, AssetFormatPipe]
})
export class NWalletPipesModule {}
