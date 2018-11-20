import { HttpErrorResponse } from '@angular/common/http';
import { ParameterExpr, createExpr } from 'forge';

export class NWHttpError extends Error {
    constructor(public response: HttpErrorResponse) {
        super();
    }
}

interface HttpParam {
    [param: string]: string | string[];
}
export interface NoQuery {}
export interface NoResponseData {}
export interface NoPayload {}
export interface NoConvert {}
export enum MethodTypes {
    INVALID,
    GET,
    POST,
    PUT
}

export abstract class HttpProtocol {
    public response: any;
    public query: HttpParam;
    public payload: any;
    public header: HttpParam;

    public abstract url: () => string;
    public abstract method: MethodTypes;
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
// remove

export abstract class AuthProtocolBase<TQuery = NoQuery, TPayload = NoPayload, TResponse = NoResponseData, TConvert = NoConvert> extends HttpProtocol {
    public payload: TPayload;
    public response: TResponse;
    public error: any;
    public convert: () => TConvert;
    constructor(data?: { query?: TQuery; payload?: TPayload }) {
        super();

        if (data) {
            if (data.query) {
                this.setQuery(data.query);
            }
            if (data.payload) {
                this.setPayload(data.payload);
            }
        }
    }

    public setQuery(expr: ParameterExpr<TQuery>): this {
        this.query = <any>createExpr(expr);
        return this;
    }

    public setPayload(expr: ParameterExpr<TPayload>): this {
        this.payload = createExpr(expr);
        return this;
    }
}
// remove

export abstract class GetProtocolBase<TQuery, TResponse, TConvert> extends HttpProtocolBase<TResponse, TConvert> {
    public method = MethodTypes.GET;

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

// remove
export abstract class PostProtocolBase<TPayload, TResponse, TConvert> extends HttpProtocolBase<TResponse, TConvert> {
    public method = MethodTypes.POST;

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
// remove

export abstract class PutProtocolBase<TPayload, TResponse, TConvert> extends HttpProtocolBase<TResponse, TConvert> {
    public method = MethodTypes.PUT;
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
