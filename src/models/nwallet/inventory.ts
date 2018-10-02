import { Item } from './asset';

const mockItems: Item[] = [
    {
        amount: '0',
        detail: {
            symbol: 'BTCShow',
            code: '0',
            price: 10
        },
        option: {
            isActive: true,
            isShow: true,
            order: 1
        }
    },
    {
        amount: '0',
        detail: {
            symbol: 'BTCHidden',
            code: '0',
            price: 10
        },
        option: {
            isActive: true,
            isShow: false,
            order: 0
        }
    },
    {
        amount: '0',
        detail: {
            symbol: 'ETH',
            code: '0',
            price: 10
        },
        option: {
            isActive: true,
            isShow: false,
            order: 5
        }
    },
    {
        amount: '0',
        detail: {
            symbol: 'ETHHidden',
            code: '0',
            price: 10
        },
        option: {
            isActive: true,
            isShow: false,
            order: 4
        }
    },
    {
        amount: '0',
        detail: {
            symbol: 'BTCInactive',
            code: '0',
            price: 100
        },
        option: {
            isActive: false,
            isShow: true,
            order: 2
        }
    }
];
export class Inventory {
    private _assetItems: Array<Item>;
    public get assetItems(): Array<Item> {
        return this._assetItems;
    }

    constructor() {
        this._assetItems = new Array<Item>();
        this.setItems(mockItems);
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
