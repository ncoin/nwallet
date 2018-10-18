import { HttpErrorResponse } from '@angular/common/http';
import { ParameterExpr, createExpr } from 'forge';
import { Debug } from '../../utils/helper/debug';



export class NWHttpError extends Error {
    constructor(public response: HttpErrorResponse) {
        super();
    }
}

export interface NoParameter {

}

export abstract class HttpRequestBase {
    constructor(protected userId: string, protected userWalletId = '') {}

    public get name(): string {
        return this.constructor.name;
    }
}
export abstract class GetRequestBase<TParameter, TResponse> extends HttpRequestBase {
    /** url parameters */

    public parameters: TParameter;
    public response: TResponse;

    public setParams(expr: ParameterExpr<TParameter>): this {
        this.parameters = createExpr(expr);
        return this;
    }

    public abstract getPath(): string;
}

export abstract class PostRequestBase<TPayload> extends HttpRequestBase {
    constructor(protected userId: string, protected userWalletId = '') {
        super(userId, userWalletId);
    }
    /** body */
    public payload: TPayload;

    public setPayload(expr: ParameterExpr<TPayload>): this {
        this.payload = createExpr(expr);
        return this;
    }
}

export abstract class PutRequestBase<TPayload> extends HttpRequestBase {
    constructor(protected userId: string, protected userWalletId = '') {
        super(userId, userWalletId);
    }
    /** body */
    public payload: TPayload;

    public setPayload(expr: ParameterExpr<TPayload>): this {
        this.payload = createExpr(expr);
        return this;
    }
}
