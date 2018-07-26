import { NgModule } from '@angular/core';
import { AnimateDirective } from './animate/animate';
@NgModule({
    declarations: [
        AnimateDirective,
    ],
    exports: [
        AnimateDirective
    ]
})
export class NWalletDirectiveModule {}
