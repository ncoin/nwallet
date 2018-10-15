import { Item } from './asset';

export class Inventory {
    private _assetItems: Array<Item>;
    public get assetItems(): Array<Item> {
        return this._assetItems;
    }

    constructor() {
        this._assetItems = new Array<Item>();
    }

    public setItems(items: Item[]): void {
        this._assetItems = items.sort((item, item2) => {
            return item.option.order - item2.option.order;
        });
    }

    public refresh(): void {
        this._assetItems = this._assetItems.sort(item => {
            return item.option.order;
        });
    }
}
