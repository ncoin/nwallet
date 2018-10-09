import { Component, ViewChild } from '@angular/core';

import { MenuController, NavController, Slides, NavParams, NavOptions } from 'ionic-angular';
import { NWalletAppService } from '../../providers/app/app.service';

@Component({
    selector: 'page-tutorial',
    templateUrl: 'tutorial.html',
})
export class TutorialPage {
    showSkip = true;

    @ViewChild('slides') slides: Slides;

    constructor(public navCtrl: NavController, public navParams: NavParams, public menu: MenuController, private appService: NWalletAppService) {}

    async startApp() {
        await this.navCtrl.pop(<NavOptions>{
            animate : true,
            animation : 'ios-transition'
        });
        this.appService.tutorialRead();
    }

    onSlideChangeStart(slider: Slides) {
        this.showSkip = !slider.isEnd();
    }

    ionViewWillEnter() {
        this.slides.update();
        // the root left menu should be disabled on the tutorial page
        this.menu.enable(false);
    }

    ionViewDidEnter() {}

    ionViewWillLeave() {
        // enable the root left menu when leaving the tutorial page
        this.menu.enable(true);
    }

    ionViewDidLeave() {}
}
