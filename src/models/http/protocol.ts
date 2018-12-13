import { HttpErrorResponse } from '@angular/common/http';
import { Debug } from '../../utils/helper/debug';

export class NWHttpError extends Error {
    constructor(public response: HttpErrorResponse) {
        super();
    }
}

interface HttpParam {
    [param: string]: string | string[];
}
export interface XDRResponse {
    xdr: string;
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
    public error: HttpErrorResponse;

    // todo decorator
    protected errorMessages: { [param: number]: string };

    public abstract url: () => string;
    public abstract method: MethodTypes;

    public get name(): string {
        return this.constructor.name;
    }

    public isSuccess() {
        return this.response !== undefined && this.error === undefined;
    }

    public setResponse(response: any): this {
        this.response = response;
        return this;
    }

    public getErrorMessage(): string {
        Debug.assert(this.error);

        if (this.error.status === 500) {
            return 'INTERNAL_ERROR';
        }

        if (this.errorMessages) {
            return `[${this.error.status}] ${this.errorMessages[this.error.status]}`;
        }

        return 'UNHANDLED';
    }
}
