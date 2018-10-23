import { Item } from './asset';
import * as _ from 'lodash';

export class Inventory {
    private _assetItems: Array<Item>;
    public get assetItems(): Array<Item> {
        return this._assetItems;
    }

    constructor() {
        this._assetItems = new Array<Item>();
    }

    public setItems(items: Item[]): void {
        this._assetItems.length = 0;
        this._assetItems.push(...items);
        this._assetItems = items.sort((item, item2) => {
            return item.option.order - item2.option.order;
        });
    }

    public addOrUpdateItems(items: Item[]): void {
        let copy = this.assetItems.slice();

        copy = _.remove(copy, target => {
            return (
                items.findIndex(item => {
                    return target.currencyId === item.currencyId;
                }) > -1
            );
        });

        copy.push(...items);
        this.setItems(copy);
    }

    public refresh(): void {
        const sort = this._assetItems.sort((item, item2) => {
            return item.option.order - item2.option.order;
        });

        // keep object reference
        this._assetItems.length = 0;

        this._assetItems.push(...sort);
    }

    public totalPrice(): number {
        let totalAmount = 0;

        this._assetItems.forEach(asset => {
            totalAmount += asset.amount * asset.detail.price;
        });

        return totalAmount;
    }

    public clear(): void {
        this._assetItems.length = 0;
    }
}
