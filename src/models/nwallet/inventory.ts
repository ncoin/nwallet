import * as Asset from './asset';
import * as _ from 'lodash';
import { BehaviorSubject, Observable, Subscriber } from 'rxjs';
import { NWTransaction } from '../nwallet';

export class Inventory {
    private _assets: BehaviorSubject<Asset.Item[]>;
    private _transactions: Map<number, BehaviorSubject<NWTransaction.Item[]>>;

    constructor() {
        this._assets = new BehaviorSubject<Asset.Item[]>([]);
        this._transactions = new Map<number, BehaviorSubject<NWTransaction.Item[]>>();
    }

    public getAssetItems(): BehaviorSubject<Asset.Item[]> {
        return this._assets;
    }

    public getTransaction(walletId: number): BehaviorSubject<NWTransaction.Item[]> {
        if (!this._transactions.has(walletId)) {
            this._transactions.set(walletId, new BehaviorSubject<NWTransaction.Item[]>([]));
        }

        return this._transactions.get(walletId);
    }

    public setItems(items: Asset.Item[]): void {
        const asset = this._assets.getValue();
        asset.length = 0;
        const sort = items.sort((item, item2) => {
            return item.option.order - item2.option.order;
        });
        asset.push(...sort);
    }

    public addOrUpdateItems(items: Asset.Item[]): void {
        let copy = this._assets.getValue().slice();

        copy = _.remove(copy, target => {
            return (
                items.findIndex(item => {
                    return target.getCurerncyId() === item.getCurerncyId();
                }) > -1
            );
        });

        copy.push(...items);
        this.setItems(copy);
    }

    public refresh(): void {
        this.setItems(this._assets.getValue().slice());
        this._assets.next(this._assets.getValue());
    }

    public clear(): void {
        this._assets.getValue().length = 0;
    }
}
