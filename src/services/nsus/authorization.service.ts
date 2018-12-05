import { env } from '../../environments/environment';
import { LoggerService } from '../common/logger/logger.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Device } from '@ionic-native/device';
import { EventService } from '../common/event/event';
import { NWEvent } from '../../interfaces/events';
import { Debug } from '../../utils/helper/debug';
import { NClientService } from './nclient.service';
import { NWAuthProtocol, NWData } from '../../models/nwallet';
import { HttpProtocol } from '../../models/http/protocol';
import { AuthProtocolBase } from '../../models/api/auth/_impl';
import { Transaction as StellarTransaction, Keypair as StellarKeypair } from 'stellar-sdk';
import { PromiseCompletionSource } from '../../../common/models';

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

class TokenIssuer {
    private tokenSource: PromiseCompletionSource<NWData.Token>;
    private token: NWData.Token;

    constructor() {
        this.prepare();
    }

    public get tokenType(): string {
        return this.token === undefined ? 'new' : 'refresh';
    }

    public get isRefresh(): boolean {
        return this.token === undefined ? false : this.token.isExpired();
    }

    public canUse(): boolean {
        return this.isValid() && !this.token.isExpired();
    }

    public isValid(): boolean {
        return this.token && this.token.access_token !== 'invalid';
    }

    public trySetToken(token: NWData.Token): boolean {
        if (token && token.access_token !== 'invalid') {
            this.token = NWData.Token.fromStorage(token);
            this.tokenSource.setResult(this.token);
            return true;
        }

        return false;
    }

    public flush(): void {
        this.token = undefined;
        this.tokenSource = undefined;
    }

    public prepare(): void {
        this.tokenSource = new PromiseCompletionSource<NWData.Token>();
    }

    public done(token: NWData.Token): this {
        Debug.assert(this.tokenSource);
        this.token = NWData.Token.fromStorage(token);
        this.tokenSource.setResult(token);
        this.tokenSource = undefined;
        return this;
    }

    public isProcessing(): boolean {
        return !this.tokenSource.isCompleted();
    }

    public getValueAsync(): Promise<NWData.Token> {
        return this.tokenSource.getResultAsync();
    }
}

@Injectable()
export class AuthorizationService {
    private tokenIssuer: TokenIssuer;
    private init: PromiseCompletionSource<boolean>;
    private isProcessing = false;
    private userName: string;
    constructor(private logger: LoggerService, private device: Device, private event: EventService, private nClient: NClientService) {
        this.tokenIssuer = new TokenIssuer();
        this.initialize();
    }

    private get deviceId(): string {
        return this.device.uuid ? this.device.uuid : getNonce();
    }

    private async initialize(): Promise<void> {
        this.init = new PromiseCompletionSource<boolean>();
        this.logger.debug('[auth] initialize');

        this.event.subscribe(NWEvent.App.user_login, async context => {
            Debug.assert(context.userName);
            this.logger.debug('[auth] user login :', context);
            this.userName = context.userName.replace('+', '').replace('-', '');
            this.init.setResult(true);
        });

        this.event.subscribe(NWEvent.App.user_logout, () => {
            this.init = new PromiseCompletionSource<boolean>();
            this.logger.debug('[auth] user logout :', this.userName);
            this.tokenIssuer.flush();
            this.userName = undefined;
        });
    }

    public async getToken(): Promise<NWData.Token> {
        // wait service initialization
        await this.init.getResultAsync();

        // 1. prevent multiple issue requests
        if (this.isProcessing) {
            this.logger.debug('[auth] token requested : token issue processing');
            return this.tokenIssuer.getValueAsync();
        }

        // 2. if token were already issued, return current token value
        if (this.tokenIssuer.canUse()) {
            this.logger.debug('[auth] token requested : use stored token');
            return this.tokenIssuer.getValueAsync();
        }

        this.isProcessing = true;

        this.logger.debug(`[auth] token requested : use [${this.tokenIssuer.tokenType}] token`);
        const token = await this.issueToken();
        this.tokenIssuer.done(token).prepare();
        this.isProcessing = false;
        return token;
    }

    private async issueToken(): Promise<NWData.Token> {
        const isRefresh = this.tokenIssuer.isRefresh;
        let payload: NWAuthProtocol.TokenPayload;
        const tokenKind = isRefresh ? 'refresh token' : 'new token';
        this.logger.debug(`[auth] issue token prepare : ${tokenKind}`);

        if (isRefresh) {
            payload = {
                refresh_token: (await this.tokenIssuer.getValueAsync()).refresh_token,
                grant_type: 'refresh_token'
            };
        } else {
            payload = {
                username: this.userName,
                device_id: this.deviceId,
                grant_type: 'password'
            };
        }

        return await this.nClient
            .auth(new NWAuthProtocol.IssueToken().setPayload(payload))
            .then(this.onSuccess())
            .then(p => p.convert())
            .catch((response: HttpErrorResponse) => {
                this.logger.error(`[auth] issue token failed : ${tokenKind}`, response);
                if (response.status === 401 || response.status === 0) {
                    this.event.publish(NWEvent.App.error_occured, { reason: 'unauth' });
                }
                return NWData.Token.Empty;
            });
    }

    public signXdr(xdr: string, tempPvt: string): string {
        const transaction = new StellarTransaction(xdr);
        // sign
        transaction.sign(StellarKeypair.fromSecret(tempPvt));

        // transaction to xdr;
        return transaction
            .toEnvelope()
            .toXDR()
            .toString('base64');
    }

    public authMobileNumber(countryCode: string, number: string): Promise<boolean> {
        return this.auth(
            new NWAuthProtocol.VerifyPhone({
                payload: {
                    countryCode: countryCode,
                    number: number
                }
            })
        );
    }

    public async verifyMobileNumber(countryCode: string, number: string, securityCode: string): Promise<boolean> {
        return this.auth(
            new NWAuthProtocol.VerifyPhoneComplete({
                payload: {
                    countryCode: countryCode,
                    number: number,
                    verifyCode: securityCode
                }
            })
        );
    }

    public async verifyResetMobileNumber(phoneNumber: string): Promise<boolean> {
        return true;
    }

    public async resetResetNewMobileNumber(phoneNumber: string): Promise<boolean> {
        return true;
    }

    public async verifySecurityCode() {}

    public async resetPincode(currentPin: string, newPin: string): Promise<boolean> {
        return true;
    }

    private auth<T extends AuthProtocolBase>(protocol: T): Promise<boolean> {
        return this.nClient
            .auth(protocol)
            .then(this.onSuccess())
            .then(() => true)
            .catch(this.onError(false));
    }

    private onSuccess<T extends HttpProtocol>(): (p: T) => T | PromiseLike<T> {
        return (protocol: T) => {
            this.logger.debug(`[auth] protocol succeed : ${protocol.name}`);
            if (protocol.response) {
                this.logger.debug(`[auth] protocol response : ${protocol.name}`, protocol.response);
            }

            return protocol;
        };
    }

    private onError<T>(failover?: T): (protocol: any) => T | PromiseLike<T> {
        return protocol => {
            this.logger.error(`[auth] protocol error : ${protocol.name}`, protocol);
            return failover;
        };
    }
}
