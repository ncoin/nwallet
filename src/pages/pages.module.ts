
import { NWalletDirectiveModule } from './../directives/directive.module';

// import { PinModalPage } from './1.security/pin/pin';
import { NWalletPipesModule } from './../pipes/pipes.module';
import { WalletLoanPage } from './wallet-detail/wallet-loan/wallet-loan';
import { WalletBuyPage } from './wallet-detail/wallet-buy/wallet-buy';
import { CreateAccountPage } from './1.account/createaccount';
import { NgModule } from '@angular/core';
import { WalletDetailPage } from './wallet-detail/wallet-detail';
import { IonicPageModule } from 'ionic-angular';
import { TutorialPage } from './tutorial/tutorial';
import { EntrancePage } from './0.entrance/entrance';
import { WalletPage } from './wallet/wallet';
import { ImportAccountPage } from './1.account/importaccount';
import { FingerprintModalPage } from './1.security/fingerprint/fingerprint';
import { PinPad } from './1.security/pin/pin-pad/pin-pad';
import { PinDots } from './1.security/pin/pin-dot/pin-dots';
import { PinModalPage } from './1.security/pin/pin';
import { NWalletSharedModule } from '../shared/shared.module';


@NgModule({
    declarations: [
        TutorialPage,
        EntrancePage,
        CreateAccountPage,
        WalletPage,
        ImportAccountPage,
        WalletDetailPage,
        WalletBuyPage,
        WalletLoanPage,
        FingerprintModalPage,
        PinDots,
        PinPad,
        PinModalPage,
    ],
    imports: [
        NWalletPipesModule,
        NWalletDirectiveModule,
        NWalletSharedModule,
        IonicPageModule.forChild(TutorialPage),
        IonicPageModule.forChild(EntrancePage),
        IonicPageModule.forChild(WalletPage),
        IonicPageModule.forChild(CreateAccountPage),
        IonicPageModule.forChild(ImportAccountPage),
        IonicPageModule.forChild(WalletDetailPage),
        IonicPageModule.forChild(WalletBuyPage),
        IonicPageModule.forChild(WalletLoanPage),
        IonicPageModule.forChild(FingerprintModalPage),
        IonicPageModule.forChild(PinDots),
        IonicPageModule.forChild(PinPad),
        IonicPageModule.forChild(PinModalPage),
    ],
    entryComponents: [TutorialPage, EntrancePage, WalletPage],
})
export class NWalletPageModule {}

