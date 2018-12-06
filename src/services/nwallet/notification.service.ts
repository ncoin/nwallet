import { Injectable } from '@angular/core';
import { AuthorizationService } from './authorization.service';
import { Debug } from '../../utils/helper/debug';
import { EventService } from '../common/event/event';
import { NWEvent, EventParameter } from '../../interfaces/events';
import { LoggerService } from '../common/logger/logger.service';
import { StreamType } from '../../interfaces/stream';
import { NWalletStream, NOTIFICATIONS } from '../../models/api/stream';

@Injectable()
export class NotificationService {
    private sources: NWalletStream[] = [];
    private streams = NOTIFICATIONS;

    constructor(private auth: AuthorizationService, private event: EventService, private logger: LoggerService) {
        this.event.subscribe(NWEvent.App.user_login, () => {
            this.openStream();
        });
        this.event.subscribe(NWEvent.App.user_logout, () => {
            this.closeStream();
        });
    }

    private async openStream(): Promise<void> {
        const token = await this.auth.getToken();
        const path = token ? token.getValue() : '';

        this.streams.forEach(stream => this.sources.push(new stream(path, this.onEvent).init()));
    }

    private onEvent = (streamType: StreamType, event: MessageEvent, data: any): void => {
        this.logger.debug(`[notification] on stream :`, streamType, data);
        this.event.publish(EventParameter.from(streamType), data);
    };

    private closeStream(): void {
        this.sources.forEach(source => {
            source.close();
        });
    }

    public flush(): void {
        this.sources.forEach(source => {
            source.flush();
        });
        this.sources.length = 0;
    }
}
