import { Inventory } from './inventory';

export class Account {
    public inventory: Inventory;
    constructor() {
        this.inventory = new Inventory();
    }
}
