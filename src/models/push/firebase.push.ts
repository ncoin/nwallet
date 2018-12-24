import { AppPushBase } from './base';
import { EventService } from '../../services/common/event/event.service';
import { NWEvent } from '../../interfaces/events';
import { BackgroundMode } from '@ionic-native/background-mode';
import { Push, PushOptions, PushObject } from '@ionic-native/push';
import { LoggerService } from '../../services/common/logger/logger.service';

export class FirebaseAppPush extends AppPushBase {
    private pushObject: PushObject;
    constructor(private event: EventService, private backgroundMode: BackgroundMode, private push: Push, private logger: LoggerService) {
        super();
        this.init();
    }

    private async init(): Promise<void> {
        this.event.subscribe(NWEvent.App.on_ready, () => {
            this.enableBackgroundMode();
            this.registerPushOptions();
        });
    }

    private enableBackgroundMode(): void {
        this.backgroundMode.enable();
        this.backgroundMode.on('activate').subscribe(() => {
            this.logger.debug('[firebase-push] background mode has been activated.');
        });

        // background mode가 deactivate 될 때 실행된다.
        this.backgroundMode.on('deactivate').subscribe(() => {
            this.logger.debug('[firebase-push] background mode has been deactivated.');
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
            android: {
                senderID: '198003300146', // App's senderID. Please check your firebase configuration
                sound: 'true',
                clearBadge: true
            }
        };

        this.pushObject = this.push.init(options);

        this.pushObject.on('registration').subscribe((registration: any) => {
            this.logger.debug('[firebase-push] device registered :', JSON.stringify(registration));
        });

        this.pushObject.on('notification').subscribe(async (notification: any) => {
            this.logger.debug('[firebase-push] received a notification :' + JSON.stringify(notification));

            let badgeNumber = await this.pushObject.getApplicationIconBadgeNumber();
            this.logger.debug('[firebase-push] before badge count :', badgeNumber);

            const count = notification.count ? notification.count : 0;

            badgeNumber = await this.pushObject.setApplicationIconBadgeNumber(count);
            this.logger.debug('set badge count: ' + badgeNumber);

            badgeNumber = await this.pushObject.getApplicationIconBadgeNumber();
            this.logger.debug('after badge count: ' + badgeNumber);
        });

        this.pushObject.on('error').subscribe(error => {
            this.logger.debug('Error with Push plugin', JSON.stringify(error));
        });
    }
}
