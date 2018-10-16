import { EventType } from '../../../interfaces/events';
import { Events } from 'ionic-angular';
import { Injectable } from '@angular/core';

@Injectable()
export class EventProvider {
    constructor(private event: Events) {}

    subscribe<T>(event: EventType<T>, func: (param: T) => void): (param: T) => void {
        this.event.subscribe(event.key, func);
        return func;
    }

    unsubscribe<T>(event: EventType<T>, func: (param: T) => void): void {
        const result = this.event.unsubscribe(event.key, func);
        if (!result) {
            throw new Error('[event] event unsubscribe failed, fuction not registered');
        }
    }

    publish<T>(event: EventType<T>, param?: T): void {
        this.event.publish(event.key, param);
    }
}
