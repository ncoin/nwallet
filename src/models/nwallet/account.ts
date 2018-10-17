import { Inventory } from './inventory';
import { Personal } from './personal';
import { Debug } from '../../utils/helper/debug';

export class Account {
    public inventory: Inventory;
    public personal: Personal;
    constructor() {
        this.inventory = new Inventory();
        this.personal = new Personal();
    }

    public initialize(data: Account): Account {
        Object.assign(this.inventory, data.inventory);
        Object.assign(this.personal, data.personal);
        Debug.Assert(this.inventory);
        Debug.Assert(this.personal);
        Debug.Validate(this.inventory);
        Debug.Validate(this.personal);
        return this;
    }

    public flush(): void {
        this.inventory.clear();
        this.personal.clear();
    }

    public getUserName(): string {
        return this.personal.phoneNumber.replace('+', '').replace('-', '');
    }
}

export { Inventory, Personal };
