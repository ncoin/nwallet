import { AccountTabPage } from './0.tab/5.account-tab/account-tab.page';
import { CreateAccountPage } from './1.account/createaccount';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TutorialPage } from './0.tutorial/tutorial';
import { EntrancePage } from './0.entrance/entrance.page';
import { ImportAccountPage } from './1.account/importaccount';
import { FingerprintModalPage } from './1.security/fingerprint/fingerprint';
import { PinPadComponent } from './1.security/pin/pin-pad/pin-pad';
import { PinDotsComponent } from './1.security/pin/pin-dot/pin-dots';
import { PinModalPage } from './1.security/pin/pin';
import { NWalletSharedModule } from '../shared/shared.module';
import { NWalletTabPages } from './0.tab/0.container/tabcontainer';
import { NWalletComponentsModule } from '../components/components.module';
import { TranslateModule } from '@ngx-translate/core';
import { ReceivePage } from './0.tab/1.transfer-tab/receive/receive.page';
import { SendPage } from './0.tab/1.transfer-tab/send/send.page';
import { QRScanPage } from './qrscan/qrscan.page';
import { ModalNavPage } from './0.base/modal-nav.page';
import { VERIFY_PHONE_PAGES } from './verify-phone/verify-phone.page';


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
        ReceivePage,
        SendPage,
        QRScanPage,
        ...VERIFY_PHONE_PAGES,
        ModalNavPage
    ],
    imports: [
        NWalletSharedModule,
        NWalletComponentsModule,
        TranslateModule.forChild(),
        IonicPageModule.forChild(TutorialPage),
        IonicPageModule.forChild(EntrancePage),
        IonicPageModule.forChild(CreateAccountPage),
        IonicPageModule.forChild(ImportAccountPage),
        IonicPageModule.forChild(FingerprintModalPage),
        IonicPageModule.forChild(PinDotsComponent),
        IonicPageModule.forChild(PinPadComponent),
        IonicPageModule.forChild(PinModalPage),
        IonicPageModule.forChild(NWalletTabPages),
        IonicPageModule.forChild(ReceivePage),
        IonicPageModule.forChild(SendPage),
        IonicPageModule.forChild(QRScanPage),
        IonicPageModule.forChild(VERIFY_PHONE_PAGES),
        IonicPageModule.forChild(ModalNavPage)
    ],
    entryComponents: [TutorialPage, EntrancePage, ...NWalletTabPages, ModalNavPage]
})
export class NWalletPageModule {}
