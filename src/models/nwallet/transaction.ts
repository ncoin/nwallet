export class Item {
    public dates: {
        creationDate: Date;
        occuredDate: Date;
    };

    groupDate: Date;

    constructor(private data: Data) {
        this.dates = {
            creationDate: new Date(data.created_date),
            occuredDate: new Date(data.occur_date)
        };

        this.groupDate = new Date(this.dates.occuredDate.getFullYear(), this.dates.occuredDate.getMonth(), this.dates.occuredDate.getDate());
    }

    public getId(): number {
        return this.data.id;
    }

    public getType(): string {
        return this.data.transaction_type;
    }

    public getAmount(): number {
        return this.data.amount;
    }
}

export class Data {}

export class Detail {}
