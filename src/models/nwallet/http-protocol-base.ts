import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { ParameterExpr, createExpr } from 'forge';
import { Debug } from '../../utils/helper/debug';
import { HttpProtocolDecorator } from './http-protocol';

export class NWHttpError extends Error {
    constructor(public response: HttpErrorResponse) {
        super();
    }
}

export interface NoQuery {}
export interface NoResponse {

}

export abstract class HttpRequestBase {

    public abstract url: () => string;
    public header: { [param: string]: string | string[] };
    constructor(protected credential: { userId: string }) {}

    public get name(): string {
        return this.constructor.name;
    }
}

export abstract class GetRequestBase<TQuery, TResponse> extends HttpRequestBase {
    public response: TResponse;
    public query: { [param: string]: string | string[] };
    /** url parameters */
    constructor(credential: { userId: string }) {
        super(credential);
    }

    public setQuery(expr: ParameterExpr<TQuery>): this {
        this.query = <any>createExpr(expr);
        return this;
    }
}

export abstract class PostRequestBase<TPayload, TResponse> extends HttpRequestBase {

    /** url parameters */
    public response: TResponse;
    constructor(credential: { userId: string }, public payload?: ParameterExpr<TPayload>) {
        super(credential);
        if (this.payload) {
            this.setPayload(this.payload);
        }
    }

    public setPayload(expr: ParameterExpr<TPayload>): this {
        this.payload = createExpr(expr);
        return this;
    }
}

export abstract class PutRequestBase<TPayload> extends HttpRequestBase {

    constructor(credential: { userId: string }, public payload?: ParameterExpr<TPayload>) {
        super(credential);
        if (this.payload) {
            this.setPayload(this.payload);
        }
    }

    /** body */
    public setPayload(expr: ParameterExpr<TPayload>): this {
        this.payload = createExpr(expr);
        return this;
    }
}
