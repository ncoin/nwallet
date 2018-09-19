import { Injectable } from '@angular/core';
import { LoggerService } from '$services/cores/logger/logger.service';
import { PreferenceService, Preference } from '$services/cores/preference/preference.service';
import { EventService } from '$services/cores/event/event.service';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {
    constructor(private logger: LoggerService, private translate: TranslateService, private preference: PreferenceService, private event: EventService) {}

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
