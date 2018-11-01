import { HttpErrorResponse } from '@angular/common/http';
import { ParameterExpr, createExpr } from 'forge';

export class NWHttpError extends Error {
    constructor(public response: HttpErrorResponse) {
        super();
    }
}

export interface NoQuery {}
export type NoResponse = () => void;
export type NoConvert = () => void;
export type methodType = 'get' | 'post' | 'put';

export abstract class HttpProtocolBase<TResponse, TConvert> {
    public response: TResponse;
    public error: any;
    public abstract url: () => string;
    public abstract method: methodType;

    public header: { [param: string]: string | string[] };
    constructor(protected credential: { userId: string }) {}

    public get name(): string {
        return this.constructor.name;
    }

    public convert(data: TResponse): TConvert {
        throw new Error(`[${this.name}] convert method not impled.`);
    }
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

export abstract class PutProtocolBase<TPayload, TResponse, TConvert> extends HttpProtocolBase<TResponse, TConvert> {
    public method: methodType = 'put';
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
