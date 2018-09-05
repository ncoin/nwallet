import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { NgxQRCodeModule } from 'ngx-qrcode2';

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        NgxQRCodeModule
    ],
    exports: [BrowserModule, HttpClientModule, NgxQRCodeModule],
})
export class NWalletSharedModule {}
