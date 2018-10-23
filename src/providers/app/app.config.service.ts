import { Constants } from '../../environments/template';
import { EventService } from '../common/event/event';
import { PreferenceProvider, Preference } from '../common/preference/preference';
import { Injectable } from '@angular/core';
import { LoggerService } from '../common/logger/logger.service';
import { TranslateService } from '@ngx-translate/core';
import { NsusChannelService } from '../nsus/nsus-channel.service';

@Injectable()
export class AppConfigService {
    constructor(
        private logger: LoggerService,
        private translate: TranslateService,
        private preference: PreferenceProvider,
        private event: EventService,
        private channel: NsusChannelService
    ) {}

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

    public async getCurrentLanguage(): Promise<{
        languages: { key: string; value: string }[];
        currentLanguage: { key: string; value: string };
    }> {
        const promises = Constants.supportedLanuages.map(async lang => {
            const trans = await this.translate.getTranslation(lang).toPromise();
            return { key: lang, value: trans.CurrentLanguage as string };
        });

        // prevent get traslation bug.. ask me --sky`
        this.translate.getTranslation(this.translate.currentLang);

        const languagePairs = await Promise.all(promises);
        const currentLanguage = languagePairs.find(pair => {
            return pair.key === this.translate.currentLang;
        });

        return {
            languages: languagePairs,
            currentLanguage: currentLanguage
        };
    }

    public async saveLanguage(languageKey: string) {
        this.translate.use(languageKey);

        this.preference.set(Preference.App.language, languageKey);
    }

    public async hasSeenTutorial(): Promise<boolean> {
        return await this.preference.get(Preference.App.hasSeenTutorial);
    }

    public async setPushNotification(isEnable: boolean): Promise<boolean> {
        const result = await this.channel.setUserPush(isEnable);
        if (result) {
            await this.preference.set(Preference.App.notification, isEnable);
        }

        return result;
    }
}
