/** asset information */
export class Item {
    public data: Data;
    /** asset detail */
    public detail: Detail;
    /** asset option */
    public option: Option;

    public get amount(): number {
        return this.data.balance;
    }
}
/** wallet protocol interface */
export class Data {}
/** asset detail information */
export class Detail {}

/** asset option information */
export class Option {}
