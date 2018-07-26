export abstract class NWalletItemBase {
    abstract get getCode(): string;
    abstract get price(): number;
    abstract set price(value: number);
}

export abstract class NWalletAssetBase  {
    /** asset name */
    code: string;
    price: number;

    constructor() {}

    public Add(price: number): void {
        if (price <= 0) {
            throw new Error('Method not implemented.');
        }
        this.price += price;
    }
}

export class NCoin extends NWalletAssetBase {
}

export class NCash extends NWalletAssetBase {
}

export class Lumen extends NWalletAssetBase {
}
