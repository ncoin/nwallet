import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { AssetItemComponent } from './asset-item/asset-item';
import { NWalletPipesModule } from '../pipes/pipes.module';
import { FaIconComponent } from './fa-icon/fa-icon.component';
import { TranslateModule } from '@ngx-translate/core';
import { NWalletDirectiveModule } from '../directives/directive.module';
import { KeyPadComponent } from './key-pad/key-pad.component';
import { InternationalPhoneComponent } from './popovers/international-phone/international-phone';

const COMPONENTS = [AssetItemComponent, FaIconComponent, KeyPadComponent, InternationalPhoneComponent];
@NgModule({
    declarations: COMPONENTS,
    imports: [TranslateModule.forChild(), NWalletPipesModule, NWalletDirectiveModule, IonicModule],
    exports: [...COMPONENTS, NWalletPipesModule, NWalletDirectiveModule],
    entryComponents : [InternationalPhoneComponent]
})
export class NWalletComponentsModule {}
