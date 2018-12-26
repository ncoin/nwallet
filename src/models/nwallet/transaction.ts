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
        return this.data.creationDate;
    }

    public get address(): string {
        return this.data.address;
    }

    public get fee() {
        return this.data.fee;
    }

    public get transactionId(): string {
        return this.data.bc_transaction_id;
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
    public readonly groupDate: Date;
    public readonly detail: Detail;

    constructor(raw: Data) {
        // this.detail = Object.assign(new Detail(), JSON.parse(raw.response_detail.toString()));
        Object.assign(this, raw);

        this.creationDate = new Date(raw.created_date);
        this.groupDate = new Date(this.creationDate.getFullYear(), this.creationDate.getMonth());

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

export class Collateral {
    public readonly GroupDate: Date;
    public readonly CreationDate: Date;

    constructor(data: Collateral) {
        Object.assign(this, data);

        this.CreationDate = new Date(data.created_date);
        this.GroupDate = new Date(this.CreationDate.getFullYear(), this.CreationDate.getMonth());
    }

    public get Id(): number {
        return this.id;
    }

    public get Type(): string {
        return this.type;
    }

    public get Amount(): number {
        return this.amount;
    }
}
