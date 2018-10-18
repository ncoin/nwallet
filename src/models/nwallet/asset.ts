/** asset information */
export class Item {
    public data: Data;
    /** asset detail */
    public detail: Detail;
    /** asset option */
    public option: Option;

    public sss: number;

    public get amount(): number {
        return this.data.balance;
    }

    static toProtocol(): (datas: Data[]) => Item[] {
        return (datas: Data[]): Item[] => {
            return datas.map(new Item().toProtocol());
        };
    }
}
/** wallet protocol interface */
export class Data {}
/** asset detail information */
export class Detail {}

/** asset option information */
export class Option {}
