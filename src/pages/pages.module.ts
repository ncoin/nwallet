import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TutorialPage } from './0.tutorial/tutorial';
import { EntrancePage } from './entrance/entrance.page';
import { FingerprintModalPage } from './1.security/fingerprint/fingerprint';
import { PinPadComponent } from './1.security/pin/pin-pad/pin-pad';
import { PinDotsComponent } from './1.security/pin/pin-dot/pin-dots';
import { PinModalPage } from './1.security/pin/pin';
import { NWalletSharedModule } from '../shared/shared.module';
import { NWalletTabPages } from './0.tab/0.container/tabcontainer';
import { NWalletComponentsModule } from '../components/components.module';
import { TranslateModule } from '@ngx-translate/core';
import { QRScanPage } from './qrscan/qrscan.page';
import { ModalNavPage } from './base/modal-nav.page';
import { VERIFY_PHONE_PAGES } from './entrance/verify-phone/verify-phone.page';


@NgModule({
    declarations: [
        TutorialPage,
        EntrancePage,
        FingerprintModalPage,
        PinDotsComponent,
        PinPadComponent,
        PinModalPage,
        QRScanPage,
        ModalNavPage,
        ...NWalletTabPages,
        ...VERIFY_PHONE_PAGES
    ],
    imports: [
        NWalletSharedModule,
        NWalletComponentsModule,
        TranslateModule.forChild(),
        IonicPageModule.forChild(TutorialPage),
        IonicPageModule.forChild(EntrancePage),
        IonicPageModule.forChild(FingerprintModalPage),
        IonicPageModule.forChild(PinDotsComponent),
        IonicPageModule.forChild(PinPadComponent),
        IonicPageModule.forChild(PinModalPage),
        IonicPageModule.forChild(NWalletTabPages),
        IonicPageModule.forChild(QRScanPage),
        IonicPageModule.forChild(VERIFY_PHONE_PAGES),
        IonicPageModule.forChild(ModalNavPage)
    ],
    entryComponents: [TutorialPage, EntrancePage, ...NWalletTabPages, ModalNavPage]
})
export class NWalletPageModule {}
