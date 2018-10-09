import { Injectable } from '@angular/core';
import { NClientProvider } from './nclient';

@Injectable()
export class NsusChannelService {
    constructor(private nClient: NClientProvider) {}

    public async requestPhoneVerification(): Promise<boolean> {
        return new Promise<boolean>(resolve => {
            setTimeout(() => {
                resolve(true);
            }, 2000);
        });
    }
}
