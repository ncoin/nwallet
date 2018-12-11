import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { LocaleService, CountryService } from 'ng4-intl-phone';

/**
 * obsoleted -- sky^
 */
@Component({
    template: `
        <ion-list>
            <button ion-item *ngFor="let country of countries" (click)="onCountryChanged(country)">{{ country.country }} {{ country.code }}</button>
        </ion-list>
    `
})
export class InternationalPhoneComponent {
    public countries: Array<{ country: string; code: string }> = [];

    constructor(public viewCtrl: ViewController, private locale: LocaleService, private country: CountryService) {
        const names = this.locale.getLocales('en');
        const countries = this.country.getCountries();
        countries.forEach(entity => {
            this.countries.push({ country: names[entity.countryCode], code: entity.dialCode });
        });
    }

    onCountryChanged(country: any) {
        this.viewCtrl.dismiss(country);
    }
}
