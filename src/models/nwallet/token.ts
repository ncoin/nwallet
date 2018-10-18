import { TestabilityRegistry } from '@angular/core';
import { TypeScriptEmitter } from '@angular/compiler';
import { Debug } from '../../utils/helper/debug';

export class Token {
    static readonly Empty = <Token>undefined;

    private expiredDate: number;
    /** exprire seconds */
    private expires_in = 0;

    // todo extract --sky`
    static capitalize(value: string) {
        return value.charAt(0).toUpperCase() + value.slice(1);
    }

    /** for SSE */
    public getValue(): string {
        return this.access_token;
    }

    public getUserId(): string {
        return this.user_id.toString();
    }

    public getAuth(): string {
        return `${Token.capitalize(this.token_type)} ${this.access_token}`;
    }

    public setExpiration() {
        this.expiredDate = Date.now() + this.expires_in * 1000;
    }

    public isExpired(): boolean {
        Debug.assert(this.expiredDate);
        return Date.now() > this.expiredDate;
    }
}
