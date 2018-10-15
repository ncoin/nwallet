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
        if (!this.token) {
            this.token = await this.issueToken(false);
        }

        if (this.token.isExpired()) {
            this.token = await this.issueToken(true);
        }

        return this.token;
    }
    private async issueToken(isRefresh: boolean): Promise<Token> {
        const id = this.device.uuid ? this.device.uuid : getNonce();
        let parameters;

        this.logger.debug(`[token] issue token ... : ${isRefresh ? 'refresh' : 'new'}`);

        if (isRefresh) {
            parameters = {
                refresh_token: this.token.refresh_token,
                grant_type: 'refresh_token'
            };
        } else {
            if (env.name === 'dev') {
                /** todo api aggregate --sky */
                parameters = {
                    username: this.account.account_new.personal.getUserName(),
                    device_id: id,
                    grant_type: 'password'
                };
            } else {
                throw new Error('stage / prod issue token not implemented yet.');
            }
        }

        const issuedToken = await this.http
            .post<Token>(env.endpoint.token(), parameters, {
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
