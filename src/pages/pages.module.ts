import { NWalletDirectiveModule } from '../directives/directive.module';

// import { PinModalPage } from './1.security/pin/pin';
import { NWalletPipesModule } from '../pipes/pipes.module';
import { CreateAccountPage } from './1.account/createaccount';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TutorialPage } from './0.tutorial/tutorial';
import { EntrancePage } from './0.entrance/entrance';
import { ImportAccountPage } from './1.account/importaccount';
import { FingerprintModalPage } from './1.security/fingerprint/fingerprint';
import { PinPadComponent } from './1.security/pin/pin-pad/pin-pad';
import { PinDotsComponent } from './1.security/pin/pin-dot/pin-dots';
import { PinModalPage } from './1.security/pin/pin';
import { NWalletSharedModule } from '../shared/shared.module';
import { NWalletTabPages } from './0.tab/0.container/tabcontainer';
import { NWalletComponentsModule } from '../components/components.module';


@NgModule({
    declarations: [
        TutorialPage,
        EntrancePage,
        CreateAccountPage,
        ImportAccountPage,
        FingerprintModalPage,
        PinDotsComponent,
        PinPadComponent,
        PinModalPage,
        ...NWalletTabPages,
    ],
    imports: [
        NWalletSharedModule,
        NWalletComponentsModule,
        IonicPageModule.forChild(TutorialPage),
        IonicPageModule.forChild(EntrancePage),
        IonicPageModule.forChild(CreateAccountPage),
        IonicPageModule.forChild(ImportAccountPage),
        IonicPageModule.forChild(FingerprintModalPage),
        IonicPageModule.forChild(PinDotsComponent),
        IonicPageModule.forChild(PinPadComponent),
        IonicPageModule.forChild(PinModalPage),
        // IonicPageModule.forChild(NWalletTabPages),

    ],
    entryComponents: [TutorialPage, EntrancePage,  ...NWalletTabPages],
})
export class NWalletPageModule {}

