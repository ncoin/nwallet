import { PushServiceBase } from './push.service';
import { EventService } from '../event/event.service';
import { BackgroundMode } from '@ionic-native/background-mode';
import { Push, PushOptions, PushObject } from '@ionic-native/push';
import { LoggerService } from '../logger/logger.service';
import { Injectable } from '@angular/core';
import { PlatformService } from '../platform/platform.service';
import { PromiseCompletionSource } from '../../../../common/models';

@Injectable()
export class FirebasePushService extends PushServiceBase {
    private pushObject: PushObject;
    private tokenTask: PromiseCompletionSource<string>;
    constructor(event: EventService, logger: LoggerService, background: BackgroundMode, platform: PlatformService, private push: Push) {
        super(event, logger, background, platform);
        this.tokenTask = new PromiseCompletionSource<string>();
    }

    public getDeviceTokenAsync(): Promise<string> {
        return this.tokenTask.getResultAsync();
    }

    protected onLoad(): void {
        this.registerPushOptions();
    }

    private async registerPushOptions(): Promise<void> {
        const hasPermision = await this.push.hasPermission();
        if (hasPermision.isEnabled) {
            this.logger.debug('[push-firebase] We have permission to send push notifications.');
        } else {
            // Please give user notification
            this.logger.debug('[push-firebase] We do not have permission to send push notifications.');
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

        this.pushObject.on('registration').subscribe(registration => {
            this.logger.debug('[push-firebase] device registered token :', registration.registrationId);
            this.logger.debug('[push-firebase] device registered type :', (<any>registration).registrationType);
        });

        this.pushObject.on('notification').subscribe(async (notification: any) => {
            this.logger.debug('[push-firebase] received a notification :', JSON.stringify(notification));

            let badgeNumber = await this.pushObject.getApplicationIconBadgeNumber();
            this.logger.debug('[push-firebase] before badge count :', badgeNumber);

            const count = notification.count ? notification.count : 0;

            badgeNumber = await this.pushObject.setApplicationIconBadgeNumber(count);
            this.logger.debug('[push-firebase] set badge count :', badgeNumber);

            badgeNumber = await this.pushObject.getApplicationIconBadgeNumber();
            this.logger.debug('[push-firebase] after badge count :', badgeNumber);
        });

        this.pushObject.on('error').subscribe(error => {
            this.logger.debug('[push-firebase] error with Push plugin', JSON.stringify(error));
        });
    }
}
