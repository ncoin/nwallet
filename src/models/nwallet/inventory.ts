import * as Asset from './wallet';
import * as _ from 'lodash';
import { BehaviorSubject, Observable, Subscriber } from 'rxjs';
import { NWTransaction, NWAsset } from '../nwallet';

export class Inventory {
    private _assets: BehaviorSubject<Asset.Item[]>;
    /** key : wallet Id */
    private _transactions: Map<number, BehaviorSubject<NWTransaction.Item[]>>;
    /** key : collateral Id */
    private _collaterals: Map<number, BehaviorSubject<NWTransaction.Collateral[]>>;

    constructor() {
        this._assets = new BehaviorSubject<Asset.Item[]>([]);
        this._transactions = new Map<number, BehaviorSubject<NWTransaction.Item[]>>();
        this._collaterals = new Map<number, BehaviorSubject<NWTransaction.Collateral[]>>();
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

    public getCollateralTransaction(collateralId: number): BehaviorSubject<NWTransaction.Collateral[]> {
        if (!this._collaterals.has(collateralId)) {
            this._collaterals.set(collateralId, new BehaviorSubject<NWTransaction.Collateral[]>([]));
        }

        return this._collaterals.get(collateralId);
    }

    public insertCollateralTransaction(collateralId: number, collaterals: NWTransaction.Collateral[]): BehaviorSubject<NWTransaction.Collateral[]> {
        const subject = this.getCollateralTransaction(collateralId);
        const sources = subject.getValue();
        const result = _.filter(collaterals, c => !sources.find(s => s.Id === c.Id));
        sources.push(...result);
        subject.next(sources);
        return subject;
    }

    public insertTransactions(walletId: number, items: NWTransaction.Item[]) {
        const transactions = this.getTransaction(walletId).getValue();
        const result = _.filter(items, c => !transactions.find(s => s.id === c.id));
        transactions.push(...result);
        transactions.sort((t1, t2) => t2.id - t1.id);
        this.getTransaction(walletId).next(transactions);
    }

    // todo
    public setItems(items: Asset.Item[]): void {
        const asset = this._assets.getValue();
        items.sort((item, item2) => item.option.order - item2.option.order);
        asset.length = 0;
        asset.push(...items);
    }

    // todo
    public addOrUpdateItems(...updateItems: Asset.Item[]): void {
        let source = this._assets.getValue();
        source = _.remove(source, target => updateItems.find(item => target.getCurrencyId() === item.getCurrencyId()));
        source.push(...updateItems);
        this.setItems(source);
    }

    public refresh(): void {
        this.setItems(this._assets.getValue().slice());
        this._assets.next(this._assets.getValue());
    }

    public clear(): void {
        this._assets.getValue().length = 0;
    }
}
