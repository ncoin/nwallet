import { Paths } from './paths';
import { PostProtocolBase } from '../http/http-protocol';
import { Token as _Token } from '../../token';

export type TokenPayload = { refresh_token: string; grant_type: string } | { username: string; device_id: string; grant_type: string };
export class Token extends PostProtocolBase<TokenPayload, _Token, _Token> {
    constructor() {
        super({ userId: 'unknown' });
        this.header = {
            Authorization: `Basic ${btoa(`app-n-wallet:app-n-wallet`)}`,
            'Content-Type': 'application/json',
            Accept: 'application/json'
        };
    }
    public url = () => Paths.token();
    public convert(): _Token {
        return Object.assign(new _Token(), this.response).setExpiration();
    }
}
