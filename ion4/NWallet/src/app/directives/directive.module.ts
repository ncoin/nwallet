import { NgModule } from '@angular/core';
import { AnimateDirective } from './animate/animate.directive';
@NgModule({
    declarations: [
        AnimateDirective,
    ],
    exports: [
        AnimateDirective
    ]
})
export class NWalletDirectiveModule {}
