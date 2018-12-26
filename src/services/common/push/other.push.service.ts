import { Injectable } from '@angular/core';
import { PushServiceBase } from './push.service';

@Injectable()
export class OtherPushService extends PushServiceBase {
    public getDeviceTokenAsync(): Promise<string> {
        throw new Error('Method not implemented.');
    }
    protected onLoad(): void {
        //
    }
}
