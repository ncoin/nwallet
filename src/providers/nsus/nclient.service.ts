import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoggerService } from '../common/logger/logger.service';
import { env } from '../../environments/environment';
import { GetRequestBase, PutRequestBase, PostRequestBase } from '../../models/nwallet/http-protocol-base';

@Injectable()
export class NClientService {
    constructor(private logger: LoggerService, private http: HttpClient) {}

    public async get<TRequest, TResponse>(request: GetRequestBase<TRequest, TResponse>): Promise<TResponse> {
        this.logger.debug(`[nclient] execute protocol : ${request.name}`);
        return this.http
            .get<TResponse>(env.endpoint.api(request.url()), {
                headers: request.header,
                params: request.query
            })
            .toPromise();
    }

    public async put<TRequest>(request: PutRequestBase<TRequest>): Promise<Object> {
        this.logger.debug(`[nclient] execute protocol : ${request.name}`);
        return this.http
            .put(env.endpoint.api(request.url()), request.payload, {
                headers: request.header
            })
            .toPromise();
    }

    public async post<TPayload, TResponse>(request: PostRequestBase<TPayload, TResponse>): Promise<TResponse> {
        this.logger.debug(`[nclient] execute protocol : ${request.name}`);
        return this.http
            .post<TResponse>(env.endpoint.api(request.url()), request.payload, {
                headers: request.header
            })
            .toPromise();
    }
}
