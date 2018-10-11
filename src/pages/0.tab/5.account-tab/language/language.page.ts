import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { AppConfigProvider } from '../../../../providers/app/app.config';

@IonicPage()
@Component({
    selector: 'page-language',
    templateUrl: 'language.page.html'
})
export class LanguagePage {
    supportedLanguagesPair: { key: string; value: string }[];
    currentLanguage: { key: string; value: string } = { key: '', value: '' };

    constructor(private navCtrl: NavController, private appConfig: AppConfigProvider) {
        this.init();
    }

    private async init(): Promise<void> {
        const languages = await this.appConfig.getCurrentLanguage();
        this.supportedLanguagesPair = languages.languages;
        this.currentLanguage = languages.currentLanguage;
    }

    public onLanguageChanged(language: { key: string; value: string }): void {
        this.currentLanguage = language;
        this.appConfig.saveLanguage(language.key);
    }
}
