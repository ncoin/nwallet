import { Inventory } from './inventory';
import { Personal } from './personal';

export class Account {
    public inventory: Inventory;
    public personal: Personal;
    constructor() {
        this.inventory = new Inventory();
        this.personal = new Personal();
    }
}

export { Inventory, Personal };
