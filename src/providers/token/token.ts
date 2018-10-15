import { AccountService } from '../account/account.service';
import { env } from '../../environments/environment';
import { LoggerService } from '../common/logger/logger.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Device } from '@ionic-native/device';
import { Keypair } from 'stellar-sdk';

class TokenProtocol {
    access_token: string;
    token_type: string;
    refresh_token: string;
    scope: string;
    user_id: number;
    jti: string;
}
export class Token extends TokenProtocol {
    static readonly Empty = <Token>undefined;

    private expiredDate: number;
    /** exprire seconds */
    private expires_in: number;

    // todo extract --sky`
    static capitalize(value: string) {
        return value.charAt(0).toUpperCase() + value.slice(1);
    }

    public getAuth(): string {
        return `${Token.capitalize(this.token_type)} ${this.access_token}`;
    }

    public setExpiration() {
        this.expiredDate = Date.now() + this.expires_in * 1000;
    }

    public isExpired(): boolean {
        return Date.now() > this.expiredDate;
    }
}

// for test (remove me) --sky`
const nonceRange = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
let devNonce = '';
export function getNonce(): string {
    if (devNonce) {
        return devNonce;
    } else {
        let nonce = '';
        for (let i = 0; i < 20; i++) {
            nonce += nonceRange.charAt(Math.floor(Math.random() * nonceRange.length));
        }

        const current = new Date();
        devNonce = `${env.name}_nonce_${current.getFullYear()}/${current.getMonth() + 1}/${current.getDate()}_${nonce}`;
        return devNonce;
    }
}

@Injectable()
export class TokenProvider {
    private token: Token;

    constructor(private http: HttpClient, private logger: LoggerService, private device: Device, private account: AccountService) {}

    public async getToken(): Promise<Token> {
        if (!this.token || this.token.isExpired()) {
            this.token = await this.issueToken();
        }

        return this.token;
    }

    private async issueToken(): Promise<Token> {
        const id = this.device.uuid ? this.device.uuid : getNonce();
        const devParameter = {
            username: '821088888888',
            device_id: id,
            grant_type: 'password'
        };
        this.logger.debug('[token] issue token ...');
        const issuedToken = await this.http
            .post<Token>(env.endpoint.token(), env.name === 'dev' ? devParameter : {}, {
                headers: {
                    Authorization: `Basic ${btoa(`app-n-wallet:app-n-wallet`)}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            })
            .toPromise()
            .then(tokenData => {
                const token = Object.assign(new Token(), tokenData);
                this.logger.debug('[token] issue token done');
                token.setExpiration();
                return token;
            })
            .catch((response: HttpErrorResponse) => {
                this.logger.error('[token] issue token failed', response);
                return Token.Empty;
            });

        return issuedToken;
    }
}
