import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoggerService } from '../common/logger/logger.service';
import { MethodTypes, HttpProtocol } from '../../models/http/protocol';
import { Debug } from '../../utils/helper/debug';

@Injectable()
export class NetworkService {
    constructor(private logger: LoggerService, private http: HttpClient) {}

    public async request<T extends HttpProtocol>(promise: Promise<T>): Promise<T> {
        const protocol = await promise;
        this.logger.debug(`[network] protocol execute : ${protocol.name}`);
        Debug.assert(protocol.method !== MethodTypes.INVALID);
        // todo extract
        if (protocol.method === MethodTypes.GET) {
            return this.http
                .get(protocol.url(), {
                    headers: protocol.header,
                    params: protocol.query
                })
                .toPromise()
                .then(this.onSuccess(protocol))
                .catch(this.onError(protocol));
        } else if (protocol.method === MethodTypes.POST) {
            return this.http
                .post(protocol.url(), protocol.payload, {
                    headers: protocol.header
                })
                .toPromise()
                .then(this.onSuccess(protocol))
                .catch(this.onError(protocol));
        } else if (protocol.method === MethodTypes.PUT) {
            return this.http
                .put(protocol.url(), protocol.payload, {
                    headers: protocol.header
                })
                .toPromise()
                .then(this.onSuccess(protocol))
                .catch(this.onError(protocol));
        }
    }

    // test
    public auth<T extends HttpProtocol>(protocol: T): Promise<T> {
        Debug.assert(protocol.method !== MethodTypes.INVALID);
        this.logger.debug(`[network] auth protocol execute : ${protocol.name}`);

        // todo extract
        if (protocol.method === MethodTypes.GET) {
            return this.http
                .get(protocol.url(), {
                    headers: protocol.header,
                    params: protocol.query
                })
                .toPromise()
                .then(this.onSuccess(protocol))
                .catch(this.onError(protocol));
        } else if (protocol.method === MethodTypes.POST) {
            return this.http
                .post(protocol.url(), protocol.payload, {
                    headers: protocol.header
                })
                .toPromise()
                .then(this.onSuccess(protocol))
                .catch(this.onError(protocol));
        } else if (protocol.method === MethodTypes.PUT) {
            return this.http
                .put(protocol.url(), protocol.payload, {
                    headers: protocol.header
                })
                .toPromise()
                .then(this.onSuccess(protocol))
                .catch(this.onError(protocol));
        }
    }

    private onSuccess<T extends HttpProtocol>(protocol: T) {
        return response => {
            return protocol.setResponse(response);
        };
    }

    private onError<T extends HttpProtocol>(protocol: T) {
        return (error: HttpErrorResponse) => {
            protocol.error = error;
            // application : text
            if (error.status === 200 || error.status === 201) {
                return protocol;
            }
            throw protocol;
        };
    }
}