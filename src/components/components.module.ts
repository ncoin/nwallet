import { NgModule } from '@angular/core';
import { AssetItemComponent } from './asset-item/asset-item';
import { NWalletPipesModule } from '../pipes/pipes.module';
@NgModule({
    declarations: [AssetItemComponent],
    imports: [NWalletPipesModule],
    exports: [AssetItemComponent],
})
export class NWalletComponentsModule {}
export const NWalletComponents = [
    AssetItemComponent
]
