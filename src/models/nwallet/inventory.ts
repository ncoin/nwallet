import * as Asset from './asset';
import * as _ from 'lodash';
import { BehaviorSubject, Observable, Subscriber } from 'rxjs';
import { NWTransaction, NWAsset } from '../nwallet';

export class Inventory {
    private _assets: BehaviorSubject<Asset.Item[]>;
    private _transactions: Map<number, BehaviorSubject<NWTransaction.Item[]>>;

    constructor() {
        this._assets = new BehaviorSubject<Asset.Item[]>([]);
        this._transactions = new Map<number, BehaviorSubject<NWTransaction.Item[]>>();
    }

    public init(data: Inventory): this {
        if (data && data._assets && data._assets.value) {
            this._assets.next(data._assets.value);
        }
        return this;
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

    public insertTransactions(walletId: number, items: NWTransaction.Item[]) {
        const transactions = this.getTransaction(walletId).getValue();
        items.forEach(item => {
            if (!_.find(transactions, t => t.id === item.id)) {
                transactions.push(item);
            }
        });

        transactions.sort((t1, t2) => t2.id - t1.id);

        this.getTransaction(walletId).next(transactions);
    }

    public setItems(items: Asset.Item[]): void {
        const asset = this._assets.getValue();
        items.sort((item, item2) => item.option.order - item2.option.order);
        asset.length = 0;
        asset.push(...items);
    }

    public addOrUpdateItems(...items: Asset.Item[]): void {
        let copy = this._assets.getValue().slice();

        copy = _.remove(copy, target => {
            return (
                items.findIndex(item => {
                    return target.getCurrencyId() === item.getCurrencyId();
                }) > -1
            );
        });

        copy.push(...items);
        this.setItems(copy);
    }

    // public addOrUpdateData(data: Asset.Data): void {
    //     const assets = this._assets.getValue();
    //     const target = assets.find(asset => asset.getWalletId() === data.id);
    //     if (target) {
    //         target.updateData(data);
    //     } else {
    //         const item = new NWAsset.Item().initData(data);
    //         this.addOrUpdateItems([item]);
    //     }
    // }

    public refresh(): void {
        this.setItems(this._assets.getValue().slice());
        this._assets.next(this._assets.getValue());
    }

    public clear(): void {
        this._assets.getValue().length = 0;
    }
}
