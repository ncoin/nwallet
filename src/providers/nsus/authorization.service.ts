import { AccountService } from '../account/account.service';
import { env } from '../../environments/environment';
import { LoggerService } from '../common/logger/logger.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Device } from '@ionic-native/device';
import { PromiseWaiter } from 'forge/dist/helpers/Promise/PromiseWaiter';
import { PreferenceProvider, Preference } from '../common/preference/preference';
import { Token } from '../../models/nwallet/token';
import { EventService } from '../common/event/event';
import { NWEvent } from '../../interfaces/events';
import { Debug } from '../../utils/helper/debug';
import { NClientService } from './nclient.service';
import { NWAuthProtocol } from '../../models/nwallet';
import { VerifyPhone } from '../../models/nwallet/protocol/auth/verifications';

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
export class AuthorizationService {
    private token: Token;
    private tokenSource: PromiseWaiter<Token>;
    private init: PromiseWaiter<boolean>;
    private deviceId: string;
    private userName: string;
    constructor(private logger: LoggerService, private device: Device, private preference: PreferenceProvider, private event: EventService, private nClient: NClientService) {
        this.deviceId = this.device.uuid ? this.device.uuid : getNonce();
        this.initialize();
    }

    private async initialize(): Promise<void> {
        this.init = new PromiseWaiter<boolean>();
        this.logger.debug('[auth] initialize');

        this.event.subscribe(NWEvent.App.user_login, async context => {
            Debug.assert(context.userName);
            this.logger.debug('[auth] user login', context);
            this.userName = context.userName;

            const token = await this.preference.get(Preference.Nwallet.token);
            if (token) {
                this.logger.debug('[auth][initialize] stored token exist', token);
                this.token = Object.assign(new Token(), token);
            } else {
                this.logger.debug('[auth][initialize] stored token not exists');
            }

            this.init.set(true);
        });

        this.event.subscribe(NWEvent.App.user_logout, () => {
            this.init = new PromiseWaiter<boolean>();
            this.logger.debug('[auth] user logout', this.userName);
            this.token = undefined;
            this.userName = undefined;
            this.preference.remove(Preference.Nwallet.token);
            this.tokenSource = undefined;
        });
    }

    public async getToken(): Promise<Token> {
        await this.init.result();
        if (this.tokenSource) {
            return await this.tokenSource.result();
        }

        this.tokenSource = new PromiseWaiter<Token>();

        if (this.token === undefined || this.token.isExpired()) {
            this.logger.debug(`[auth] token requested : use ${this.token === undefined ? 'new' : 'refresh'} token`);
            this.token = await this.issueToken(this.token === undefined ? false : this.token.isExpired());

            await this.preference.set(Preference.Nwallet.token, this.token);
        } else {
            this.logger.debug('[auth] token requested : use stored token');
        }

        this.tokenSource.set(this.token);
        this.tokenSource = undefined;
        return this.token;
    }

    private async issueToken(isRefresh: boolean): Promise<Token> {
        let payload: NWAuthProtocol.TokenPayload;
        const tokenKind = isRefresh ? 'refresh' : 'new';
        this.logger.debug(`[auth] issue token begin : ${tokenKind}`);

        if (isRefresh) {
            payload = {
                refresh_token: this.token.refresh_token,
                grant_type: 'refresh_token'
            };
        } else {
            if (env.name === 'dev') {
                /** todo api aggregate --sky */
                payload = {
                    username: this.userName,
                    device_id: this.deviceId,
                    grant_type: 'password'
                };
            } else {
                throw new Error('stage / prod issue token not implemented yet.');
            }
        }

        const issuedToken = await this.nClient
            .post(new NWAuthProtocol.Token().setPayload(payload))
            .then(protocol => {
                this.logger.debug(`[auth] issue token done : ${tokenKind}`);
                return protocol.convert();
            })
            .catch((response: HttpErrorResponse) => {
                this.logger.error(`[auth] issue token failed : ${tokenKind}`, response);
                if (response.status === 401) {
                    this.event.publish(NWEvent.App.error_occured, { reason: 'unauth' });
                }
                return Token.Empty;
            });

        return issuedToken;
    }

    public authMobileNumber(countryCode: string, number: string): Promise<boolean> {
        return this.nClient
            .auth(
                new NWAuthProtocol.VerifyPhone({
                    payload: {
                        countryCode: countryCode,
                        number: number
                    }
                })
            )
            .then(protocol => {
                this.logger.debug(`[auth] auth phone number (secure code request) success :`, protocol);
                return true;
            })
            .catch((response: HttpErrorResponse) => {
                this.logger.error(`[auth] auth phone number (secure code request) failed :`, response);
                return false;
            });
    }

    public async verifyMobileNumber(countryCode: string, number: string, securityCode: string) {
        return this.nClient
            .auth(
                new NWAuthProtocol.VerifyPhoneComplete({
                    payload: {
                        countryCode: countryCode,
                        number: number,
                        verifyCode: securityCode
                    }
                })
            )
            .then(protocol => {
                this.logger.debug(`[auth] verify phone number (secure code request) success :`, protocol);
                return true;
            })
            .catch((response: HttpErrorResponse) => {
                this.logger.error(`[auth] verify phone number (secure code request) failed :`, response);
                return false;
            });
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
}
