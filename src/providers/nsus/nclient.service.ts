import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoggerService } from '../common/logger/logger.service';
import { env } from '../../environments/environment';
import { GetProtocolBase, PutProtocolBase, PostProtocolBase } from '../../models/nwallet/protocol/http/http-protocol';
import { Debug } from '../../utils/helper/debug';

@Injectable()
export class NClientService {
    constructor(private logger: LoggerService, private http: HttpClient) {}

    public get<TQuery, TResponse, TConvert>(protocol: GetProtocolBase<TQuery, TResponse, TConvert>): Promise<GetProtocolBase<TQuery, TResponse, TConvert>> {
        this.logger.debug(`[nclient] execute protocol : ${protocol.name}`);
        Debug.assert(protocol.method === 'get');

        return this.http
            .get<TResponse>(env.endpoint.api(protocol.url()), {
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
        Debug.assert(protocol.method === 'put');

        return this.http
            .put<TResponse>(env.endpoint.api(protocol.url()), protocol.payload, {
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
        Debug.assert(protocol.method === 'post');

        return this.http
            .post<TResponse>(env.endpoint.api(protocol.url()), protocol.payload, {
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
}
