import { HttpErrorResponse } from '@angular/common/http';
import { ParameterExpr, createExpr } from 'forge';

export class NWHttpError extends Error {
    constructor(public response: HttpErrorResponse) {
        super();
    }
}

export interface NoQuery {}
export type NoResponse = () => void;
export type NoPayload = () => void;
export type NoConvert = () => void;
export type methodType = 'get' | 'post' | 'put';

export abstract class HttpProtocol {
    public response: any;

    public abstract url: () => string;
    public abstract method: methodType;
    public header: { [param: string]: string | string[] };
    public get name(): string {
        return this.constructor.name;
    }
}

export abstract class HttpProtocolBase<TResponse, TConvert> extends HttpProtocol {
    public response: TResponse;

    public error: any;

    constructor(protected credential: { userId: string }) {
        super();
    }

    public convert: () => TConvert;
}

export abstract class GetProtocolBase<TQuery, TResponse, TConvert> extends HttpProtocolBase<TResponse, TConvert> {
    public method: methodType = 'get';

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

export abstract class PostProtocolBase<TPayload, TResponse, TConvert> extends HttpProtocolBase<TResponse, TConvert> {
    public method: methodType = 'post';
    public payload: TPayload;
    /** url parameters */
    constructor(credential: { userId: string }, payloadExpr?: ParameterExpr<TPayload>) {
        super(credential);
        if (payloadExpr) {
            this.setPayload(payloadExpr);
        }
    }

    public setPayload(expr: ParameterExpr<TPayload>): this {
        this.payload = createExpr(expr);
        return this;
    }
}

export abstract class PutProtocolBase<TPayload, TResponse, TConvert> extends HttpProtocolBase<TResponse, TConvert> {
    public method: methodType = 'put';
    public payload: TPayload;

    constructor(credential: { userId: string }, payloadExpr?: ParameterExpr<TPayload>) {
        super(credential);
        if (payloadExpr) {
            this.setPayload(payloadExpr);
        }
    }

    /** body */
    public setPayload(expr: ParameterExpr<TPayload>): this {
        this.payload = createExpr(expr);
        return this;
    }
}
