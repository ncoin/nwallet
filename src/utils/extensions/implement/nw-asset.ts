import { Item } from '../../../models/nwallet/asset';

export function getNameStatic(this: Item): void {
    console.log(this.amount);
}

Item.prototype.getName = getNameStatic;
