import { LoggerService } from '../logger/logger.service';
import { Injectable, isDevMode } from '@angular/core';
import { Platform } from 'ionic-angular';
import { debug } from 'util';
import { read } from 'fs';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { env } from '../../../environments/environment';


// move location
function wrap(logger: LoggerService, orientation: ScreenOrientation) {
    const lock = orientation.lock;
    const unlock = orientation.unlock;
    if (isDevMode()) {

        orientation['devType'] = orientation.type;
        orientation.lock = async (o: string): Promise<any> => {
            logger.debug('[screen-orientaton] lock orientation :', o);
            orientation['devType'] = o;
        };

        orientation.unlock = (): void => {
            logger.debug('[screen-orientaton] unlock orientation');
        };
    }
}

@Injectable()
export class PlatformService {
    public isAndroid: boolean;
    public isIOS: boolean;
    public isSafari: boolean;
    public isCordova: boolean;
    public isNW: boolean;
    public ua: string;
    public isMobile: boolean;
    public isDevel: boolean;

    constructor(private platform: Platform, private logger: LoggerService, public orientation: ScreenOrientation) {
        let userAgent = navigator ? navigator.userAgent : null;

        if (!userAgent) {
            this.logger.info('Could not determine navigator. Using fixed string');
            userAgent = 'dummy user-agent';
        }

        // Fixes IOS WebKit UA
        userAgent = userAgent.replace(/\(\d+\)$/, '');

        this.isAndroid = this.platform.is('android');
        this.isIOS = this.platform.is('ios');
        this.ua = userAgent;
        this.isCordova = this.platform.is('cordova');
        this.isNW = this.isNodeWebkit();
        this.isMobile = this.platform.is('mobile');
        this.isDevel = !this.isMobile && !this.isNW;

        this.platform.ready().then(ready => {
            wrap(this.logger, this.orientation);
        });
    }

    public getBrowserName(): string {
        const userAgent = window.navigator.userAgent;
        const browsers = {
            chrome: /chrome/i,
            safari: /safari/i,
            firefox: /firefox/i,
            ie: /internet explorer/i
        };

        for (const key in browsers) {
            if (browsers[key].test(userAgent)) {
                return key;
            }
        }

        return 'unknown';
    }

    public isNodeWebkit(): boolean {
        const isNode = typeof process !== 'undefined' && typeof require !== 'undefined';
        if (isNode) {
            try {
                return typeof (window as any).require('nw.gui') !== 'undefined';
            } catch (e) {
                return false;
            }
        }
        return false;
    }
}
