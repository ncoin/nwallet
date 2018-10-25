import { Debug } from '../../utils/helper/debug';

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
/** wallet protocol interface */
export class Data {}

/** asset option information */
export class Option {}
