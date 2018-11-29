import { Debug } from '../../utils/helper/debug';

export class Item {
    public data: Data;

    constructor(private raw: Data) {
        this.data = new Data(this.raw);

        Debug.assert(this.data);
    }


    public get id(): number {
        return this.data.id;
    }

    public get transactionType(): string {
        return this.data.transaction_type;
    }

    public get date(): Date {
        return this.data.occuredDate;
    }

    public get addressFrom(): string {
        return this.data.from_address;
    }

    public get addressTo(): string {
        return this.data.to_address;
    }

    public get fee() {
        return this.data.fee;
    }

    public get transactionId(): string {
        return this.data.id.toString();
    }

    public get confirmation(): number {
        return -99999;
        // return this.data.;
    }

    public get amount(): number {
        return this.data.amount;
    }

    public get groupDate(): Date {
        return this.data.groupDate;
    }
}

export class Data {
    public readonly creationDate: Date;
    public readonly occuredDate: Date;
    public readonly groupDate: Date;
    public readonly detail: Detail;

    constructor(raw: Data) {
        // this.detail = Object.assign(new Detail(), JSON.parse(raw.response_detail.toString()));
        Object.assign(this, raw);

        this.creationDate = new Date(raw.created_date);
        this.occuredDate = new Date(raw.occur_date);
        this.groupDate = new Date(this.occuredDate.getFullYear(), this.occuredDate.getMonth(), this.occuredDate.getDate());

        Debug.Validate(this);
        // Debug.Validate(this.detail);
    }
}

export class Detail {
    constructor() {}

    public get confirmation(): number {
        return !this.confirmations ? 0 : this.confirmations;
    }
}
