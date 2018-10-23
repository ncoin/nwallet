import { AccountService } from '../account/account.service';
import { env } from '../../environments/environment';
import { LoggerService } from '../common/logger/logger.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Device } from '@ionic-native/device';
import { PromiseWaiter } from 'forge/dist/helpers/Promise/PromiseWaiter';
import { PreferenceProvider, Preference } from '../common/preference/preference';
import { Token } from '../../models/nwallet/token';

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
        devNonce = `${env.name}_${current.getFullYear()}/${current.getMonth() + 1}/${current.getDate()}_nonce_${nonce}`;
        return devNonce;
    }
}

@Injectable()
export class TokenService {
    private token: Token;
    private tokenSource: PromiseWaiter<Token>;
    private init: PromiseWaiter<boolean>;

    public id: string;

    constructor(private http: HttpClient, private logger: LoggerService, private device: Device, private account: AccountService, private preference: PreferenceProvider) {
        this.id = this.device.uuid ? this.device.uuid : getNonce();
        this.initialize();
    }

    private async initialize(): Promise<void> {
        this.init = new PromiseWaiter<boolean>();
        const token = await this.preference.get(Preference.Nwallet.token);
        if (token) {
            this.logger.debug('[token][initialize] stored token exist', token);
            this.token = Object.assign(new Token(), token);
        } else {
            this.logger.debug('[token][initialize] stored token not exists');
        }

        this.init.set(true);
        this.logger.debug('[token][initialize] done');
    }

    public async getToken(): Promise<Token> {
        await this.init.result();
        if (this.tokenSource) {
            return await this.tokenSource.result();
        }

        this.tokenSource = new PromiseWaiter<Token>();

        if (this.token === undefined || this.token.isExpired()) {
            this.logger.debug(`[token] token requested : use ${this.token === undefined ? 'new' : 'refresh'} token`);
            this.token = await this.issueToken(this.token === undefined ? false : this.token.isExpired());
            await this.preference.set(Preference.Nwallet.token, this.token);
        } else {
            this.logger.debug('[token] token requested : use stored token');
        }

        this.tokenSource.set(this.token);
        this.tokenSource = undefined;
        return this.token;
    }

    private async issueToken(isRefresh: boolean): Promise<Token> {
        const detail = await this.account.detail();
        let parameters;
        const tokenKind = isRefresh ? 'refresh' : 'new';

        this.logger.debug(`[token] issue token begin : ${tokenKind} ...`);

        if (isRefresh) {
            parameters = {
                refresh_token: this.token.refresh_token,
                grant_type: 'refresh_token'
            };
        } else {
            if (env.name === 'dev') {
                /** todo api aggregate --sky */
                parameters = {
                    username: detail.getUserName(),
                    device_id: this.id,
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
                const token = Object.assign(new Token(), tokenData).setExpiration();
                this.logger.debug(`[token] issue token done : ${tokenKind}`);
                return token;
            })
            .catch((response: HttpErrorResponse) => {
                this.logger.error(`[token] issue token failed : ${tokenKind}`, response);
                return Token.Empty;
            });

        return issuedToken;
    }
}
