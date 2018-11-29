import { AuthApiPaths } from './paths';
import { AuthProtocolBase } from './_impl';
import { MethodTypes, NoQuery } from '../../http/protocol';
import { NWResponse, NWData } from '../../nwallet';

interface RefreshToken {
    refresh_token: string;
    grant_type: string;
}
interface NewToken {
    username: string;
    device_id: string;
    grant_type: string;
}

export type TokenPayload = RefreshToken | NewToken;
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
    public url = () => AuthApiPaths.token();
    public convert = (): NWData.Token => NWData.Token.fromProtocol(this.response);
}
