import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoggerService } from '../common/logger/logger.service';
import { env } from '../../environments/environment';
import { GetRequestBase, PutRequestBase, PostRequestBase, HttpRequestBase } from '../../models/nwallet/http-protocol-base';
import { Subject } from 'rxjs';
import { PutWalletAlignRequest } from '../../models/nwallet/protocol/wallet-align';
import { debug } from 'util';
import { Debug } from '../../utils/helper/debug';

@Injectable()
export class NClientService {

    // hmm...
    private subscriptions: Map<string, Subject<any>> = new Map<string, Subject<any>>();

    constructor(private logger: LoggerService, private http: HttpClient) {
        this.test(PutWalletAlignRequest);
    }

    // good!!
    public test<T extends HttpRequestBase> (aa: { new ({}): T}) {
     //   Debug.assert(false, { a: aa, b: aa.name});
    }

    public async get<TRequest, TResponse>(request: GetRequestBase<TRequest, TResponse>): Promise<TResponse> {
        this.logger.debug(`[nclient] execute protocol : ${request.name}`);
        return this.http
            .get<TResponse>(env.endpoint.api(request.url()), {
                headers: request.header,
                params: request.query
            })
            .toPromise().then();
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
