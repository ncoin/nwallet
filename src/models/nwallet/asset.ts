import { Debug } from '../../utils/helper/debug';

/** wallet protocol interface */
export class Data {}

/** asset option information */
export class Option {}

/** asset information */
export class Item {
    public data: Data;
    /** asset option */
    public option: Option;

    public getSymbol(): string {
        Debug.assert(this.data);
        return this.data.currency;
    }

    public getAmount(): number {
        Debug.assert(this.data);
        return this.data.balance;
    }

    /** symbol id */
    public getCurrencyId(): number {
        Debug.assert(this.data);
        return this.data.currency_manage_id;
    }

    public getWalletId(): number {
        Debug.assert(this.data);
        return this.data.id;
    }

    public getAddress(): string {
        Debug.assert(this.data);
        return this.data.address;
    }
}

export class Available {
    constructor(data: Available) {
        Object.assign(this, data);
        Debug.assert(this);
    }
    public getSymbol(): string {
        return this.currency;
    }

    public setAlign(value: number): void {
        this.align_number = value;
    }

    public getAlign(): number {
        return this.align_number;
    }
}
