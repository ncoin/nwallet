import { AccountProvider } from '../account/account';
import { env } from '../../environments/environment';
import { Logger } from '../common/logger/logger';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Device } from '@ionic-native/device';
import { Keypair } from 'stellar-sdk';

export class Token {
    static readonly Empty = <Token>undefined;

    private access_token: string;
    private token_type: string;
    /** exprire seconds */
    private expires_in: number;
    private scope: string;
    private jti: string;
    private expiredDate: number;

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

export function getNonce(): string {
    let nonce = '';
    for (let i = 0; i < 20; i++) {
        nonce += nonceRange.charAt(Math.floor(Math.random() * nonceRange.length));
    }

    return `${env.name}_nonce_${nonce}`;
}

@Injectable()
export class TokenProvider {
    private token: Token;
    constructor(private http: HttpClient, private logger: Logger, private device: Device, private account: AccountProvider) {}

    public async getToken(): Promise<Token> {
        if (!this.token || this.token.isExpired()) {
            this.token = await this.issueToken();
        }

        return this.token;
    }

    private async issueToken(): Promise<Token> {
        const id = this.device.uuid ? this.device.uuid : getNonce();

        const account = await this.account.getAccount();
        this.logger.debug('[token] issue token ...');
        const issuedToken = await this.http
            .post<Token>(
                env.endpoint.token(),
                {
                    coin_symbol: 'XLM',
                    device_id: id,
                    public_key: account.signature.public,
                    grant_type: 'password',
                },
                {
                    headers: {
                        Authorization: `Basic ${btoa(`app-n-wallet:app-n-wallet`)}`,
                        Accept: 'application/json',
                    },
                },
            )
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
