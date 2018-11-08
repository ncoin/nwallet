import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoggerService } from '../common/logger/logger.service';
import { GetProtocolBase, PutProtocolBase, PostProtocolBase, AuthProtocolBase, MethodTypes } from '../../models/nwallet/protocol/http/http-protocol';
import { Debug } from '../../utils/helper/debug';
import { Observable } from 'rxjs';

@Injectable()
export class NClientService {
    constructor(private logger: LoggerService, private http: HttpClient) {}

    public get<TQuery, TResponse, TConvert>(protocol: GetProtocolBase<TQuery, TResponse, TConvert>): Promise<GetProtocolBase<TQuery, TResponse, TConvert>> {
        this.logger.debug(`[nclient] execute protocol : ${protocol.name}`);
        Debug.assert(protocol.method === MethodTypes.GET);

        return this.http
            .get<TResponse>(protocol.url(), {
                headers: protocol.header,
                params: protocol.query
            })
            .toPromise()
            .then(response => {
                protocol.response = response;
                return protocol;
            })
            .catch(error => {
                protocol.error = error;
                throw protocol;
            });
    }

    public put<TPayload, TResponse, TConvert>(protocol: PutProtocolBase<TPayload, TResponse, TConvert>): Promise<PutProtocolBase<TPayload, TResponse, TConvert>> {
        this.logger.debug(`[nclient] execute protocol : ${protocol.name}`);
        Debug.assert(protocol.method === MethodTypes.PUT);

        return this.http
            .put<TResponse>(protocol.url(), protocol.payload, {
                headers: protocol.header
            })
            .toPromise()
            .then(response => {
                protocol.response = response;
                return protocol;
            })
            .catch(error => {
                protocol.error = error;
                throw error;
            });
    }

    public post<TPayload, TResponse, TConvert>(protocol: PostProtocolBase<TPayload, TResponse, TConvert>): Promise<PostProtocolBase<TPayload, TResponse, TConvert>> {
        this.logger.debug(`[nclient] execute protocol : ${protocol.name}`);
        Debug.assert(protocol.method === MethodTypes.POST);

        return this.http
            .post<TResponse>(protocol.url(), protocol.payload, {
                headers: protocol.header
            })
            .toPromise()
            .then(response => {
                protocol.response = response;
                return protocol;
            })
            .catch(error => {
                protocol.error = error;
                throw error;
            });
    }

    // test
    public auth<T1, T2, T3, T4>(protocol: AuthProtocolBase<T1, T2, T3, T4>): Promise<AuthProtocolBase<T1, T2, T3, T4>> {
        Debug.assert(protocol.method !== MethodTypes.INVALID);

        // todo extract
        if (protocol.method === MethodTypes.GET) {
            return this.http
                .get<T3>(protocol.url(), {
                    headers: protocol.header,
                    params: protocol.query
                })
                .toPromise()
                .then(this.onAuthSuccess(protocol))
                .catch(this.onAuthError(protocol));
        } else if (protocol.method === MethodTypes.POST) {
            return this.http
                .post<T3>(protocol.url(), protocol.payload, {
                    headers: protocol.header
                })
                .toPromise()
                .then(this.onAuthSuccess(protocol))
                .catch(this.onAuthError(protocol));
        } else if (protocol.method === MethodTypes.PUT) {
            return this.http
                .put<T3>(protocol.url(), protocol.payload, {
                    headers: protocol.header
                })
                .toPromise()
                .then(this.onAuthSuccess(protocol))
                .catch(this.onAuthError(protocol));
        }
    }

    private onAuthSuccess<T extends AuthProtocolBase>(protocol: T) {
        return response => {
            protocol.response = response;
            return protocol;
        };
    }

    private onAuthError<T extends AuthProtocolBase>(protocol: T) {
        return (error: HttpErrorResponse) => {
            protocol.error = error;
            if (error.status === 201 || error.status === 201) {
                return protocol;
            }
            throw error;
        };
    }
}
