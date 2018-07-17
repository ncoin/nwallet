import { Events as NWEvents } from '../../../interfaces/events';
import { Events } from 'ionic-angular';
import { Injectable } from '@angular/core';

@Injectable()
export class EventProvider {
    constructor(private event: Events) {}

    subscribe<T>(event: NWEvents<T>, func: (param: T) => void): (param: T) => void {
        this.event.subscribe(event.getKey(), func);
        return func;
    }

    unsubscribe<T>(event: NWEvents<T>, func: (param: T) => void): void {
        const result = this.event.unsubscribe(event.getKey(), func);
        if (!result) {
            throw new Error('[event] event unsubscribe failed, fuction not registered');
        }
    }

    publish<T>(event: NWEvents<T>, param?: T): void {
        this.event.publish(event.getKey(), param);
    }
}
