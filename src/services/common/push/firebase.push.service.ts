import { PushServiceBase } from './push.service';
import { EventService } from '../event/event.service';
import { BackgroundMode } from '@ionic-native/background-mode';
import { Push, PushOptions, PushObject } from '@ionic-native/push';
import { LoggerService } from '../logger/logger.service';
import { Injectable } from '@angular/core';
import { PlatformService } from '../platform/platform.service';
import { Firebase } from '@ionic-native/firebase';
import { PromiseCompletionSource } from '../../../../common/models';

@Injectable()
export class FirebasePushService extends PushServiceBase {
    private pushObject: PushObject;
    private tokenTask: PromiseCompletionSource<string>;
    constructor(event: EventService, logger: LoggerService, background: BackgroundMode, platform: PlatformService, private push: Push, private firebase: Firebase) {
        super(event, logger, background, platform);
        this.tokenTask = new PromiseCompletionSource<string>();
    }

    public getDeviceTokenAsync(): Promise<string> {
        return this.tokenTask.getResultAsync();
    }

    protected onLoad(): void {
        this.tokenLoad();
        this.registerPushOptions();
    }

    private async tokenLoad() {
        const newToken = await this.firebase.getToken();
        this.logger.warn('[firebase-push] current device token :', newToken);

        this.tokenTask.setResult(newToken);

        this.firebase.onTokenRefresh().subscribe(token => {
            this.logger.warn('[firebase-push] token refreshed :', token);
            if (this.tokenTask.isCompleted) {
                this.tokenTask = new PromiseCompletionSource<string>();
            }
            this.tokenTask.setResult(token);
        });
    }

    private async registerPushOptions(): Promise<void> {
        const hasPermision = await this.push.hasPermission();
        if (hasPermision.isEnabled) {
            this.logger.debug('[firebase-push] We have permission to send push notifications.');
        } else {
            // Please give user notification
            this.logger.debug('[firebase-push] We do not have permission to send push notifications.');
        }

        const options: PushOptions = {
            // ios: {

            // }
            android: {
                senderID: '648550254266', // App's senderID. Please check your firebase configuration
                sound: 'true',
                clearBadge: true
            }
            // browser: {

            // }
        };

        this.pushObject = this.push.init(options);

        this.pushObject.on('registration').subscribe((registration: any) => {
            this.logger.debug('[firebase-push] device registered :', JSON.stringify(registration));
        });

        this.pushObject.on('notification').subscribe(async (notification: any) => {
            this.logger.debug('[firebase-push] received a notification :', JSON.stringify(notification));

            let badgeNumber = await this.pushObject.getApplicationIconBadgeNumber();
            this.logger.debug('[firebase-push] before badge count :', badgeNumber);

            const count = notification.count ? notification.count : 0;

            badgeNumber = await this.pushObject.setApplicationIconBadgeNumber(count);
            this.logger.debug('[firebase-push] set badge count :', badgeNumber);

            badgeNumber = await this.pushObject.getApplicationIconBadgeNumber();
            this.logger.debug('[firebase-push] after badge count :', badgeNumber);
        });

        this.pushObject.on('error').subscribe(error => {
            this.logger.debug('[firebase-push] error with Push plugin', JSON.stringify(error));
        });
    }
}
