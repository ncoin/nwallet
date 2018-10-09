import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { InternationalPhoneModule } from 'ng4-intl-phone';
@NgModule({
    imports: [BrowserModule, HttpClientModule, NgxQRCodeModule, InternationalPhoneModule],
    exports: [BrowserModule, HttpClientModule, NgxQRCodeModule, InternationalPhoneModule]
})
export class NWalletSharedModule {}
