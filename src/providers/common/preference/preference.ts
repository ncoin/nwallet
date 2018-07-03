import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NWallet } from '../../../interfaces/nwallet';

export namespace Preference {

    export interface Item<T> {
        name: string;
        type? : T;
    }
}

export namespace Preference.App {

    /** is tutorial proceeded? */
    export const hasSeenTutorial: Item<boolean> = { name: 'hasSeenTutorial' };
    export const language: Item<string> = { name: 'language' };
}

export namespace Preference.Nwallet{
    export const walletAccount: Item<NWallet.Account> = { name: 'walletAccount' };
}

@Injectable()
/** Storage strict type proxy */
export class PreferenceProvider {
    constructor(private storage: Storage) {
    }

    public get<T>(item: Preference.Item<T>): Promise<T> {
        return this.storage.get(item.name);
    }

    public set<T>(item: Preference.Item<T>, value: T): Promise<T> {
        return this.storage.set(item.name, value);
    }

    public remove<T>(key: Preference.Item<T>): Promise<any> {
        return this.storage.remove(key.name);
    }

    public clear(): Promise<void> {
        return this.storage.clear();
    }
}
