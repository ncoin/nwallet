import { Constants } from '../../environments/template';
import { EventService } from '../common/event/event.service';
import { PreferenceService, Preference } from '../common/preference/preference.service';
import { Injectable } from '@angular/core';
import { LoggerService } from '../common/logger/logger.service';
import { TranslateService } from '@ngx-translate/core';
import { ChannelService } from '../nwallet/channel.service';
@Injectable()
export class AppConfigService {
    constructor(
        private logger: LoggerService,
        private translate: TranslateService,
        private preference: PreferenceService,
        private event: EventService,
        private channel: ChannelService
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
        languages: { key: string; value: string; simplified: string }[];
        currentLanguage: { key: string; value: string; simplified: string };
    }> {
        const promises = Constants.supportedLanuages.map(async lang => {
            const trans = await this.translate.getTranslation(lang).toPromise();
            return { key: lang, value: trans.CurrentLanguage as string, simplified: lang.startsWith('zh') ? lang.substring(lang.indexOf('-') + 1) : lang };
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

    public async getLocale(): Promise<{ language: string; country: string; full: string }> {
        const full = navigator.language.toLocaleLowerCase();
        return {
            full: full, // en-US
            language: full.substring(0, 2), // en
            country: full.substring(3) // US
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
        let result = await this.channel.checkUserNotification();
        if (result === null) {
            result = await this.channel.registerUserNotification();
        } else {
            result = await this.channel.changeUserNotification(isEnable);
        }

        return result;
    }
}

function extract<T>(properties: Record<keyof T, any>) {
    return function<TActual extends T>(value: TActual) {
        const result = {} as T;
        for (const property of Object.keys(properties) as Array<keyof T>) {
            result[property] = value[property];
        }
        return result;
    };
}

// interface ISpecific {
//     A: string;
//     B: string;
// }
// const extractISpecific = extract<ISpecific>({
//     // This object literal is guaranteed by the compiler to have no more and no less properties then ISpecific
//     A: true,
//     B: true
// });

// class Extended implements ISpecific {
//     public A = '1';
//     public B = '2';
//     public C = '3';
// }

// const someObject = new Extended();
// const subset = extractISpecific(someObject);

// const subset2 = extract<ISpecific>({ A: 5, B: '5', C : 100 });
// const subset3 = subset2(someObject);
// console.log('dddddddddddd', subset);
// console.log('dddddddddddd', subset3);
