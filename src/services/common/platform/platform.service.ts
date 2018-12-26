import { LoggerService } from '../logger/logger.service';
import { Injectable, isDevMode } from '@angular/core';
import { Platform } from 'ionic-angular';
import { debug } from 'util';
import { read } from 'fs';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { env } from '../../../environments/environment';
import { Device } from '@ionic-native/device';
import { PromiseCompletionSource } from '../../../../common/models';
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
    public isElectron: boolean;
    public ua: string;
    public isMobile: boolean;
    public isDevel: boolean;
    private platformReady: PromiseCompletionSource<boolean>;

    constructor(private platform: Platform, private logger: LoggerService, private device: Device, public orientation: ScreenOrientation) {
        let ua = navigator ? navigator.userAgent : null;

        if (!ua) {
            this.logger.info('Could not determine navigator. Using fixed string');
            ua = 'dummy user-agent';
        }

        // Fixes IOS WebKit UA
        ua = ua.replace(/\(\d+\)$/, '');

        this.isAndroid = this.platform.is('android');
        this.isIOS = this.platform.is('ios');
        this.ua = ua;
        this.isCordova = this.platform.is('cordova');
        this.isElectron = this.isElectronPlatform();
        this.isMobile = this.platform.is('mobile');
        this.isDevel = !this.isMobile && !this.isElectron;
        this.platformReady = new PromiseCompletionSource<boolean>();

        this.platform
            .ready()
            .then(ready => {
                wrap(this.logger, this.orientation);
                this.platformReady.setResult(true);
            })
            .catch(error => {
                this.logger.warn('[platform] platform ready failed', error);
                this.platformReady.setResult(false);
            });
    }

    public waitReady(): Promise<boolean> {
        return this.platformReady.getResultAsync();
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

    public isElectronPlatform(): boolean {
        const userAgent = navigator && navigator.userAgent ? navigator.userAgent.toLowerCase() : null;
        if (userAgent && userAgent.indexOf('electron/') > -1) {
            return true;
        } else {
            return false;
        }
    }

    public getOS() {
        const OS = {
            OSName: '',
            extension: ''
        };

        if (this.isElectron) {
            if (navigator.appVersion.indexOf('Win') !== -1) {
                OS.OSName = 'Windows';
                OS.extension = '.exe';
            }
            if (navigator.appVersion.indexOf('Mac') !== -1) {
                OS.OSName = 'MacOS';
                OS.extension = '.dmg';
            }
            if (navigator.appVersion.indexOf('Linux') !== -1) {
                OS.OSName = 'Linux';
                OS.extension = '-linux.zip';
            }
        }

        return OS;
    }

    public getDeviceInfo(): string {
        let info: string;

        if (this.isElectron) {
            info = ' (' + navigator.appVersion + ')';
        } else {
            info =
                this.device.platform === null && this.device.version === null && this.device.model === null
                    ? undefined
                    : ` (${this.device.platform} ${this.device.version} - ${this.device.model})`;
        }

        return info;
    }
}
