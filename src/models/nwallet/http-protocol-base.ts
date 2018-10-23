import { HttpErrorResponse } from '@angular/common/http';
import { ParameterExpr, createExpr } from 'forge';
import { Debug } from '../../utils/helper/debug';
import { HttpProtocolDecorator } from './http-protocol';

export class NWHttpError extends Error {
    constructor(public response: HttpErrorResponse) {
        super();
    }
}

export interface NoParameter {}

export abstract class HttpRequestBase {
    public abstract url: () => string;

    constructor(protected credential: { userId: string }) {}

    public get name(): string {
        return this.constructor.name;
    }
}
export abstract class GetRequestBase<TParameter, TResponse> extends HttpRequestBase {
    public response: TResponse;
    /** url parameters */
    constructor(credential: { userId: string }, public urlParameter?: ParameterExpr<TParameter>) {
        super(credential);
        if (this.urlParameter) {
            this.setParams(this.urlParameter);
        }
    }

    public setParams(expr: ParameterExpr<TParameter>): this {
        this.urlParameter = createExpr(expr);
        return this;
    }
}

export abstract class PostRequestBase<TPayload> extends HttpRequestBase {
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
