import { Token } from '../../nwallet/token';
declare module '../../nwallet/token' {
    interface Token {
        access_token: string;
        token_type: string;
        refresh_token: string;
        scope: string;
        user_id: number;
        jti: string;
    }
}

export { Token };
