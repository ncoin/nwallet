import { PreferenceProvider, Preference } from '../common/preference/preference';
import { Injectable } from '@angular/core';
import { Logger } from '../common/logger/logger';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class AppConfigProvider {
    constructor(private logger: Logger, private translate: TranslateService, private preference: PreferenceProvider) {}

    public async loadAll(): Promise<void> {
        this.logger.debug('[appconfig] load providers');
        await Promise.all([this.loadLanguage()]);
    }

    public async hasSeenTutorial(): Promise<boolean> {
        return await this.preference.get(Preference.App.hasSeenTutorial);
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
            }else {
                this.translate.setDefaultLang('en');
            }
        }

        await this.translate.use(this.translate.getDefaultLang()).toPromise();
        this.logger.debug('[appconfig] current language :', this.translate.getDefaultLang());
    }
}
