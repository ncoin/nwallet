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
export type NoResponse = () => void;

export abstract class HttpProtocolBase<TResponse> {
    public response: TResponse;
    public abstract url: () => string;
    public abstract method: string;

    public header: { [param: string]: string | string[] };
    constructor(protected credential: { userId: string }) {}

    public get name(): string {
        return this.constructor.name;
    }
}

export abstract class GetProtocolBase<TQuery, TResponse> extends HttpProtocolBase<TResponse> {
    public method = 'get';
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

export abstract class PostProtocolBase<TPayload, TResponse> extends HttpProtocolBase<TResponse> {
    public method = 'post';

    /** url parameters */
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

export abstract class PutProtocolBase<TPayload, TResponse> extends HttpProtocolBase<TResponse> {
    public method = 'put';

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
