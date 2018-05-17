import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

export namespace StorageItem {

    export class Item<T> {
        name: string;
    }

    /** is tutorial proceeded? */
    export const hasSeenTutorial: Item<boolean> = { name: 'hasSeenTutorial' };
}

@Injectable()
export class StorageProvider {
    constructor(private storage: Storage) {
    }

    public get<T>(item: StorageItem.Item<T>): Promise<T> {
        return this.storage.get(item.name);
    }

    public set<T>(item: StorageItem.Item<T>, value: T): Promise<T> {
        return this.storage.set(item.name, value);
    }

    public remove(key: string): Promise<any> {
        return this.storage.remove(key);
    }

    public clear(): Promise<void> {
        return this.storage.clear();
    }
}
