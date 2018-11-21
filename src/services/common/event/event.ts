import { EventParameter } from '../../../interfaces/events';
import { Events } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

@Injectable()
export class EventService {
    private events: Map<string, BehaviorSubject<any>> = new Map<string, BehaviorSubject<any>>();
    constructor(private event: Events) {}

    private getOrAdd<T>(key: string): BehaviorSubject<T> {
        return this.events.has(key) ? this.events.get(key) : this.events.set(key, new BehaviorSubject<T>(undefined)).get(key);
    }

    RxSubscribe<T>(event: EventParameter<T>, func: (param: T) => void): Subscription {
        return this.getOrAdd(event.key).subscribe(func);
    }

    RxUnsubscribe(...subscription: Subscription[]): void {
        subscription.forEach(s => {
            s.unsubscribe();
        });
    }

    subscribe<T>(event: EventParameter<T>, func: (param: T) => void): (param: T) => void {
        this.event.subscribe(event.key, func);
        return func;
    }

    unsubscribe<T>(event: EventParameter<T>, func: (param: T) => void): void {
        const result = this.event.unsubscribe(event.key, func);
        if (!result) {
            throw new Error('[event] event unsubscribe failed, fuction not registered');
        }
    }

    publish<T>(event: EventParameter<T>, param?: T): void {
        this.event.publish(event.key, param);
        this.getOrAdd(event.key).next(param);
    }
}
