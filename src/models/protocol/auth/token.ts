import { Paths } from './paths';
import { AuthProtocolBase } from './impl';
import { MethodTypes, NoQuery } from '../../http/http-protocol';
import { NWResponse, NWData } from '../../nwallet';

export type TokenPayload = { refresh_token: string; grant_type: string } | { username: string; device_id: string; grant_type: string };
export class IssueToken extends AuthProtocolBase<NoQuery, TokenPayload, NWResponse.Token, NWData.Token> {
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
    public convert = (): NWData.Token => {
        return NWData.Token.fromProtocol(this.response);
    }
}
