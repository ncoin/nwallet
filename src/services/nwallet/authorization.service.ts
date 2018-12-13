import { LoggerService } from '../common/logger/logger.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Device } from '@ionic-native/device';
import { EventService } from '../common/event/event.service';
import { NWEvent } from '../../interfaces/events';
import { Debug } from '../../utils/helper/debug';
import { NetworkService } from './network.service';
import { NWAuthProtocol, NWData } from '../../models/nwallet';
import { HttpProtocol } from '../../models/http/protocol';
import { AuthProtocolBase } from '../../models/api/auth/_impl';
import { TokenIssuer } from './token-issuer';
import { Signature } from '../../interfaces/signature';
import { PreferenceService, Preference } from '../common/preference/preference.service';

// for test (remove me) --sky`
import { getNonceOnce } from '../../../common/models/nonce';
import { NWStellar } from '../../models/stellar/stellar';
import { ResultCode } from '../../interfaces/error';

@Injectable()
export class AuthorizationService {
    private tokenIssuer: TokenIssuer;

    // todo secure --sky
    private signature: Signature;
    private userName: string;
    constructor(private logger: LoggerService, private device: Device, private event: EventService, private nClient: NetworkService, private preference: PreferenceService) {
        this.tokenIssuer = new TokenIssuer(this.logger);
        this.logger.debug('[auth] initialize');

        this.event.subscribe(NWEvent.App.user_login, async context => {
            Debug.assert(context.userName);
            this.logger.debug('[auth] user login :', context);
            this.userName = context.userName.replace('+', '').replace('-', '');
            this.signature = await this.preference.get(Preference.Nwallet.signature);
            this.logger.debug('[auth] user signature :', this.signature);
        });

        this.event.subscribe(NWEvent.App.user_logout, () => {
            this.logger.debug('[auth] user logout :', this.userName);
            this.tokenIssuer.flush();
            this.userName = undefined;
            this.signature = undefined;
            this.preference.remove(Preference.Nwallet.signature);
        });
    }

    public getNCNAddress(): string {
        Debug.assert(this.signature);
        return this.signature.publicKey;
    }

    public setSignature(signature: Signature): void {
        this.signature = signature;
        this.preference.set(Preference.Nwallet.signature, this.signature);
    }

    public getToken(): Promise<NWData.Token> {
        return this.tokenIssuer.process(async () => {
            this.logger.debug(`[auth] token requested : use [${this.tokenIssuer.tokenType}] token`);
            const result = await this.issueToken();
            if (!result.isSuccess) {
                this.event.publish(NWEvent.App.error_occured, { reason: ResultCode.UnAuth });
            }

            return result.token;
        });
    }

    private async issueToken(): Promise<{ isSuccess: boolean; token: NWData.Token }> {
        let payload: NWAuthProtocol.TokenPayload;

        const refreshToken = this.tokenIssuer.tryGetRefreshToken();
        const tokenKind = refreshToken ? 'refresh token' : 'new token';
        this.logger.debug(`[auth] issue token prepare : ${tokenKind}`);
        if (refreshToken) {
            payload = {
                refresh_token: refreshToken.refresh_token,
                grant_type: 'refresh_token'
            };
        } else {
            payload = {
                username: this.userName,
                device_id: this.device.uuid ? this.device.uuid : getNonceOnce(),
                grant_type: 'password'
            };
        }

        return await this.nClient
            .auth(new NWAuthProtocol.IssueToken().setPayload(payload))
            .then(this.onSuccess())
            .then(p => ({ isSuccess: true, token: p.convert() }))
            .catch((response: HttpErrorResponse) => {
                this.logger.error(`[auth] issue token failed : ${tokenKind}`, response);
                return {
                    isSuccess: false,
                    token: NWData.Token.Empty
                };
            });
    }

    public signXdr(xdr: string): string {
        const transaction = new NWStellar.Transaction(xdr);
        transaction.sign(NWStellar.Keypair.fromSecret(this.signature.secretKey));
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
            this.logger.debug(`[auth] protocol success : ${protocol.name}`);
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
