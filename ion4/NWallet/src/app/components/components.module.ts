import { NgModule } from '@angular/core';
import { AssetItemComponent } from './asset-item/asset-item';
import { NWalletPipesModule } from '../pipes/pipes.module';
import { FaIconComponent } from './fa-icon/fa-icon.component';

@NgModule({
    declarations: [AssetItemComponent, FaIconComponent],
    imports: [NWalletPipesModule],
    exports: [AssetItemComponent],
})
export class NWalletComponentsModule {}
export const NWalletComponents = [
    AssetItemComponent, FaIconComponent
];
