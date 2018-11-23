import { HttpErrorResponse } from '@angular/common/http';

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
    public error: any;

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
}
