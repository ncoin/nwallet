import { Token as T } from '../../models/nwallet/token';
declare module '../../models/nwallet/token' {
    interface Token {
        access_token: string;
        token_type: string;
        refresh_token: string;
        scope: string;
        user_id: number;
        jti: string;
    }
}
