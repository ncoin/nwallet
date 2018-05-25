
export interface NWalletAsset {
    /** asset name */
    code: string;
    amount: number;
}

export abstract class NWalletAssetBase implements NWalletAsset {
    /** asset name */
    code: string;
    amount: number;

    constructor(){}

    public Add(amount: number): void {
        if (amount <= 0){
            throw new Error("Method not implemented.");
        }
        this.amount += amount;
    }
}

export class NCoin extends NWalletAssetBase {
}

export class NCash extends NWalletAssetBase {
}

export class Lumen extends NWalletAssetBase {
}
