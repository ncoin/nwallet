import { Debug } from '../../utils/helper/debug';

export class Token {
    static readonly Empty = <Token>{
        access_token: 'invalid'
        // todo
    };

    private expiredDate: number;
    /** exprire seconds */
    private expires_in = 0;

    static fromProtocol(token: Token): Token {
        return Object.assign(new Token(), token).setExpiration();
    }

    static fromStorage(token: Token): Token {
        return Object.assign(new Token(), token);
    }

    // todo extract --sky`
    static capitalize(value: string) {
        return value.charAt(0).toUpperCase() + value.slice(1);
    }

    /** for SSE */
    public getValue(): string {
        return this.access_token;
    }

    /** user Id */
    public getUserId(): number {
        return this.user_id;
    }

    /** user credential */
    public getAuth(): string {
        return `${Token.capitalize(this.token_type)} ${this.access_token}`;
    }

    public setExpiration(): this {
        Debug.assert(!this.expiredDate);
        this.expiredDate = Date.now() + this.expires_in * 1000;
        return this;
    }

    public isExpired(): boolean {
        Debug.assert(this.expiredDate);
        return Date.now() > this.expiredDate;
    }

    public isInvalid(): boolean {
        return this.access_token === 'invalid';
    }
}
