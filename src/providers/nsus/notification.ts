import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { env } from '../../environments/environment';
import { TokenProvider } from '../token/token';

@Injectable()
export class NotificationService {
    constructor(private token: TokenProvider) {}

    public async startStream(): Promise<void> {
        const token = await this.token.getToken();

        const streamUrl = env.endpoint.stream('ticker', token.getAuth());
        const eventSource = new EventSource(streamUrl, { withCredentials: true });

        eventSource.addEventListener('wallet', function(e) {});
    }
}
