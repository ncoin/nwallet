import { NgModule } from '@angular/core';
import { AssetItemComponent } from './asset-item/asset-item';
import { NWalletPipesModule } from '../pipes/pipes.module';
import { FaIconComponent } from './fa-icon/fa-icon.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [AssetItemComponent, FaIconComponent],
    imports: [NWalletPipesModule, TranslateModule.forChild()],
    exports: [AssetItemComponent],
})
export class NWalletComponentsModule {}
export const NWalletComponents = [
    AssetItemComponent, FaIconComponent
];
