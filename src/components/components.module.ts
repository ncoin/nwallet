import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { AssetItemComponent } from './asset-item/asset-item';
import { NWalletPipesModule } from '../pipes/pipes.module';
import { FaIconComponent } from './fa-icon/fa-icon.component';
import { TranslateModule } from '@ngx-translate/core';
import { NWalletDirectiveModule } from '../directives/directive.module';

@NgModule({
    declarations: [AssetItemComponent, FaIconComponent],
    imports: [TranslateModule.forChild(), NWalletPipesModule, NWalletDirectiveModule, IonicModule],
    exports: [AssetItemComponent, FaIconComponent, NWalletPipesModule, NWalletDirectiveModule],
})
export class NWalletComponentsModule {}
