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
        this.inventory.init(data.inventory);
        this.personal.init(data.personal);
        Debug.assert(this.inventory);
        Debug.assert(this.personal);
        Debug.Validate(this.inventory);
        Debug.Validate(this.personal);
        return this;
    }

    public flush(): void {
        this.inventory.clear();
        this.personal.clear();
    }

    /** user name : phone number */
    public getUserName(): string {
        return this.personal.phoneNumber.replace('+', '').replace('-', '');
    }

    public setUserName(userName: string): void {
        this.personal.phoneNumber = userName;
    }
}

export { Inventory, Personal };
