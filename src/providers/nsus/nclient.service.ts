import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoggerService } from '../common/logger/logger.service';
import { env } from '../../environments/environment';
import { GetProtocolBase, PutProtocolBase, PostProtocolBase } from '../../models/nwallet/http-protocol-base';

@Injectable()
export class NClientService {
    constructor(private logger: LoggerService, private http: HttpClient) {}

    public get<TQuery, TResponse>(protocol: GetProtocolBase<TQuery, TResponse>): Promise<GetProtocolBase<TQuery, TResponse>> {
        this.logger.debug(`[nclient] execute protocol : ${protocol.name}`);
        return this.http
            .get<TResponse>(env.endpoint.api(protocol.url()), {
                headers: protocol.header,
                params: protocol.query
            })
            .toPromise()
            .then(response => {
                protocol.response = response;
                return protocol;
            });
    }

    public put<TPayload, TResponse>(protocol: PutProtocolBase<TPayload, TResponse>): Promise<PutProtocolBase<TPayload, TResponse>> {
        this.logger.debug(`[nclient] execute protocol : ${protocol.name}`);
        return this.http
            .put<TResponse>(env.endpoint.api(protocol.url()), protocol.payload, {
                headers: protocol.header
            })
            .toPromise()
            .then(response => {
                protocol.response = response;
                return protocol;
            });
    }

    public post<TPayload, TResponse>(protocol: PostProtocolBase<TPayload, TResponse>): Promise<PostProtocolBase<TPayload, TResponse>> {
        this.logger.debug(`[nclient] execute protocol : ${protocol.name}`);
        return this.http
            .post<TResponse>(env.endpoint.api(protocol.url()), protocol.payload, {
                headers: protocol.header
            })
            .toPromise()
            .then(response => {
                protocol.response = response;
                return protocol;
            });
    }
}
