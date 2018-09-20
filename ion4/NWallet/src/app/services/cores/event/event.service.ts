import { Injectable } from '@angular/core';
import { Events } from '@ionic/angular';
import { NWalletEvent } from '$infrastructure/events';

@Injectable({
    providedIn: 'root'
})
export class EventService {
    constructor(private event: Events) {}

    subscribe<T>(event: NWalletEvent<T>, func: (param: T) => void): (param: T) => void {
        this.event.subscribe(event.getKey(), func);
        return func;
    }

    unsubscribe<T>(event: NWalletEvent<T>, func: (param: T) => void): void {
        const result = this.event.unsubscribe(event.getKey(), func);
        if (!result) {
            throw new Error('[event] event unsubscribe failed, fuction not registered');
        }
    }

    publish<T>(event: NWalletEvent<T>, param?: T): void {
        this.event.publish(event.getKey(), param);
    }
}
