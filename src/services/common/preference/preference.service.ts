import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NWAccount } from '../../../models/nwallet';
import { Token } from '../../../models/nwallet/token';
import { Signature } from '../../../interfaces/signature';

export namespace Preference {
    // sample
    const p = {};

    export function Item<T>(name: string): Item<T> {
        if (p[name]) {
            throw new Error(`[preference] Preference already exist : ${name}`);
        }
        p[name] = { name: name };
        return p[name];
    }

    export interface Item<T> {
        name: string;
        type?: T;
    }
}

export namespace Preference.App {
    /** is tutorial proceeded? */

    export const hasSeenTutorial = Item<boolean>('app-hasSeenTutorial');
    export const language = Item<string>('app-language');
    export const pinCode = Item<any>('app-pinCode');
    export const backupWallet = Item<any>('app-backupWallet');
    export const notification = Item<any>('app-notification');
}

export namespace Preference.Nwallet {
    export const account = Item<NWAccount.Account>('nwallet-account');
    // todo secure --sky`
    export const signature = Item<Signature>('nwallet-signature');
}

@Injectable()
/** Storage strict type proxy */
export class PreferenceService {
    constructor(private storage: Storage) {}

    public get<T>(item: Preference.Item<T>): Promise<T> {
        return this.storage.get(item.name);
    }

    public set<T>(item: Preference.Item<T>, value: T): Promise<T> {
        return this.storage.set(item.name, value);
    }

    public remove<T>(key: Preference.Item<T>): Promise<T> {
        return this.storage.remove(key.name);
    }

    public clear(): Promise<void> {
        return this.storage.clear();
    }
}
