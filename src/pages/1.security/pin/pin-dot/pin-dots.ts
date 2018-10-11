import { AnimateDirective } from '../../../../directives/animate/animate';
import { Component, Input, QueryList, SimpleChanges, ViewChildren, OnChanges } from '@angular/core';

@Component({
    selector: 'pin-dots',
    templateUrl: 'pin-dots.html'
})
export class PinDotsComponent implements OnChanges {
    public dotArray = new Array(4);

    @Input('PinCount')
    set count(value: number) {
        this.dotArray = new Array(value);
    }
    @Input()
    pin: string;
    @ViewChildren(AnimateDirective)
    dots: QueryList<AnimateDirective>;

    ngOnChanges(changes: SimpleChanges) {
        const pinChanges = changes.pin;
        if (!pinChanges) {
            return;
        }
        const currentValue = pinChanges.currentValue;
        const previousValue = pinChanges.previousValue;
        if (!currentValue.length || currentValue.length < previousValue.length) {
            return;
        }
        this.pulseDot(currentValue.length - 1);
    }

    public isFilled(limit): boolean {
        return this.pin && this.pin.length >= limit;
    }

    public pulseDot(dotIndex: number): void {
        const dot = this.dots.toArray()[dotIndex];
        dot.animate('pulse');
    }
}
