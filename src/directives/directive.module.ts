import { NgModule } from '@angular/core';
import { AnimateDirective } from './animate/animate';
import { VarDirective } from './ng/var.directive';
@NgModule({
    declarations: [AnimateDirective, VarDirective],
    exports: [AnimateDirective, VarDirective]
})
export class NWalletDirectiveModule {}
