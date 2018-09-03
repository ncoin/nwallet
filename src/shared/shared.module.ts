import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
    ],
    exports: [BrowserModule, HttpClientModule],
})
export class NWalletSharedModule {}
