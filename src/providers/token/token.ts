import { AccountProvider } from './../account/account';
import { env } from './../../environments/environment';
import { Logger } from './../common/logger/logger';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Device } from '@ionic-native/device';

export class Token {
    private access_token: string;
    private token_type: string;
    /** exprire seconds */
    private expires_in: number;
    private scope: string;
    private jti: string;
    private expiredDate: number;
    public getAuth(): string {
        return `Bearer ${this.access_token}`;
    }

    public setExpiration() {
        this.expiredDate = Date.now() + (this.expires_in * 1000);
    }

    public isExpired():boolean{
        return Date.now() > this.expiredDate;
    }
}
interface body {
    grant_type: string;
    public_key: string;
    coin_symbol: string;
    device_id: string;
    email?: string;
}
@Injectable()
export class TokenProvider {
    private requestParam: body;

    private token: Token;
    constructor(private http: HttpClient, private logger: Logger, private device: Device, private account: AccountProvider) {}

    public async getToken() : Promise<Token> {
        if (!this.token || this.token.isExpired()) {
            this.token = await this.getTokenInternal();
        }

        return this.token;
    }
    private async getTokenInternal(): Promise<Token> {
        const account = await this.account.getAccount();

        this.requestParam = <body>{
            coin_symbol: 'XLM',
            device_id: 'e383550c-369b-4eca-aca3-ea29f1722958',
            public_key: account.signature.public,
            grant_type: 'password',
        };

        const token = await this.http
            .post<Token>(`${env.endpoint.auth}uaa/api/oauth/token`, this.requestParam, {
                headers: {
                    Authorization: `Basic ${btoa(`app-n-wallet:app-n-wallet`)}`,
                },
            })
            .toPromise()
            .then(token => {
                this.logger.debug('[token] get token success', token);
                token.setExpiration();
                return token;
            })
            .catch((response: HttpErrorResponse) => {
                this.logger.error('[token] get token failed', response);
                return undefined;
            });

        this.logger.debug('token', token);
        return token;
    }
}
