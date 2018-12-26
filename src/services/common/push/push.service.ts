import { BackgroundMode } from '@ionic-native/background-mode';
import { EventService } from '../event/event.service';
import { LoggerService } from '../logger/logger.service';
import { PlatformService } from '../platform/platform.service';
import { NWEvent } from '../../../interfaces/events';

export abstract class PushServiceBase {
    protected constructor(protected event: EventService, protected logger: LoggerService, protected backgroundMode: BackgroundMode, protected platform: PlatformService) {
        this.init();
    }

    private init(): void {
        if (this.platform.getDeviceInfo()) {
            this.logger.debug('[push] begin activate');
            this.event.subscribe(NWEvent.App.on_ready, () => {
                this.enableBackgroundMode();
                this.onLoad();
            });
        } else {
            this.logger.debug('[push] not activated');
        }
    }

    private enableBackgroundMode(): void {
        this.backgroundMode.enable();
        this.backgroundMode.on('activate').subscribe(() => {
            this.logger.debug('[push] background mode has been activated.');
        });

        this.backgroundMode.on('deactivate').subscribe(() => {
            this.logger.debug('[push] background mode has been deactivated.');
        });
    }

    protected onLoad(): void {}

    public abstract getDeviceTokenAsync(): Promise<string>;
}
