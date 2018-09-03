import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TranslateModule, TranslateLoader, MissingTranslationHandler, MissingTranslationHandlerParams } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

export class MissingHandler implements MissingTranslationHandler {
    handle(params: MissingTranslationHandlerParams) {
        return `@${params.key}`;
    }
}

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient],
            },
            useDefaultLang: true,
            missingTranslationHandler: { provide: MissingTranslationHandler, useClass: MissingHandler },
        }),
    ],
    exports: [TranslateModule, BrowserModule, HttpClientModule],
})
export class NWalletSharedModule {}
