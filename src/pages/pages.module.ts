
import { NWalletDirectiveModule } from './../directives/directive.module';

// import { PinModalPage } from './1.security/pin/pin';
import { NWalletPipesModule } from './../pipes/pipes.module';
import { CreateAccountPage } from './1.account/createaccount';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TutorialPage } from './etc.tutorial/tutorial';
import { EntrancePage } from './0.entrance/entrance';
import { ImportAccountPage } from './1.account/importaccount';
import { FingerprintModalPage } from './1.security/fingerprint/fingerprint';
import { PinPad } from './1.security/pin/pin-pad/pin-pad';
import { PinDots } from './1.security/pin/pin-dot/pin-dots';
import { PinModalPage } from './1.security/pin/pin';
import { NWalletSharedModule } from '../shared/shared.module';
import { NWalletTabPages } from './tab/tabcontainer';


@NgModule({
    declarations: [
        TutorialPage,
        EntrancePage,
        CreateAccountPage,
        ImportAccountPage,
        FingerprintModalPage,
        PinDots,
        PinPad,
        PinModalPage,
        ...NWalletTabPages
    ],
    imports: [
        NWalletPipesModule,
        NWalletDirectiveModule,
        NWalletSharedModule,
        IonicPageModule.forChild(TutorialPage),
        IonicPageModule.forChild(EntrancePage),
        IonicPageModule.forChild(CreateAccountPage),
        IonicPageModule.forChild(ImportAccountPage),
        IonicPageModule.forChild(FingerprintModalPage),
        IonicPageModule.forChild(PinDots),
        IonicPageModule.forChild(PinPad),
        IonicPageModule.forChild(PinModalPage),
        //IonicPageModule.forChild(NWalletTabPages),

    ],
    entryComponents: [TutorialPage, EntrancePage,  ...NWalletTabPages],
})
export class NWalletPageModule {}

