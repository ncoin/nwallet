import { Paths } from './paths';
import { Token } from '../../nwallet/token';
import { AuthProtocolBase } from './impl';
import { MethodTypes, NoQuery } from '../../http/http-protocol';

export type TokenPayload = { refresh_token: string; grant_type: string } | { username: string; device_id: string; grant_type: string };
export class IssueToken extends AuthProtocolBase<NoQuery, TokenPayload, Token, Token> {
    public method = MethodTypes.POST;
    constructor() {
        super();
        this.header = {
            Authorization: `Basic ${btoa(`app-n-wallet:app-n-wallet`)}`,
            'Content-Type': 'application/json',
            Accept: 'application/json'
        };
    }
    public url = () => Paths.token();
    public convert = (): Token => {
        return Token.fromProtocol(this.response);
    }
}
