import { Debug } from '../../utils/helper/debug';

/** asset information */
export class Item {
    public data: Data;
    /** asset detail */
    public detail: Detail;
    /** asset option */
    public option: Option;

    public get amount(): number {
        Debug.assert(this.data);
        return this.data.balance;
    }

    public get currencyId(): number {
        Debug.assert(this.data);
        return this.data.currency_manage_id;
    }
}
/** wallet protocol interface */
export class Data {}
/** asset detail information */
export class Detail {}

/** asset option information */
export class Option {}
