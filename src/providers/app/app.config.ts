import { EventProvider } from './../common/event/event';
import { PreferenceProvider, Preference } from '../common/preference/preference';
import { Injectable } from '@angular/core';
import { Logger } from '../common/logger/logger';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class AppConfigProvider {
    constructor(private logger: Logger, private translate: TranslateService, private preference: PreferenceProvider, private event: EventProvider) {}

    public async loadAll(): Promise<void> {
        this.logger.debug('[appconfig] load providers');
        await Promise.all([this.loadLanguage()]);
    }

    private async loadLanguage(): Promise<void> {
        const language = await this.preference.get(Preference.App.language);
        if (language) {
            this.translate.setDefaultLang(language);
        } else {
            const browserLanguage = this.translate.getBrowserLang();
            const matchedLanguage = this.translate.getLangs().find(providedLanguage => {
                return providedLanguage === browserLanguage;
            });

            if (matchedLanguage) {
                this.translate.setDefaultLang(matchedLanguage);
            } else {
                this.translate.setDefaultLang('en');
            }
        }

        await this.translate.use(this.translate.getDefaultLang()).toPromise();
        this.translate.addLangs(['en', 'es', 'fr', 'de', 'it', 'ja', 'ko', 'nl', 'pl', 'pt', 'ru', 'zh-cn', 'zh-tw']);
        this.logger.debug('[appconfig] current language :', this.translate.getDefaultLang());
    }

    public async saveLanguage(languageKey: string) {
        this.translate.use(languageKey);
        this.preference.set(Preference.App.language, languageKey);
    }

    public async hasSeenTutorial(): Promise<boolean> {
        return await this.preference.get(Preference.App.hasSeenTutorial);
    }



    public async setPushNotification(isEnable: boolean): Promise<boolean> {
        // todo request --sky
        await this.preference.set(Preference.App.notification, isEnable);

        return isEnable;
    }
}
