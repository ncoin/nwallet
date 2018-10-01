import { Component, ElementRef, Input, OnChanges, SimpleChange, SimpleChanges, Renderer2 } from '@angular/core';
import { Config, Ion } from 'ionic-angular';

@Component({
    selector: 'fa-icon',
    template: '',
})
export class FaIconComponent extends Ion implements OnChanges {
    @Input()
    name: string;
    @Input()
    size: string;

    @Input('fixed-width')
    set fixedWidth(fixedWidth: string) {
        this.setElementClass('fa-fw', this.isTrueProperty(fixedWidth));
    }

    constructor(config: Config, elementRef: ElementRef, renderer: Renderer2) {
        FaIconComponentHelper.Init(renderer);
        super(config, elementRef, <any>renderer, 'fa');
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.name) {
            this.unsetPrevAndSetCurrentClass(changes.name);
        }
        if (changes.size) {
            this.unsetPrevAndSetCurrentClass(changes.size);
        }
    }

    isTrueProperty(val: any): boolean {
        if (typeof val === 'string') {
            val = val.toLowerCase().trim();
            return val === 'true' || val === 'on' || val === '';
        }
        return !!val;
    }

    unsetPrevAndSetCurrentClass(change: SimpleChange) {
        this.setElementClass('fa-' + change.previousValue, false);
        this.setElementClass('fa-' + change.currentValue, true);
    }
}

class FaIconComponentHelper {
    static isInitialized = false;

    static Init(renderer: Renderer2) {
        if (FaIconComponentHelper.isInitialized) {
            return;
        }
        Ion.prototype.setElementClass = function(className, isAdd) {
            if (isAdd) {
                renderer.addClass(this._elementRef.nativeElement, className);
            } else {
                renderer.removeClass(this._elementRef.nativeElement, className);
            }
        };
        /** @hidden */
        Ion.prototype.setElementAttribute = function(attributeName, attributeValue) {
            renderer.setAttribute(this._elementRef.nativeElement, attributeName, attributeValue);
        };
        /** @hidden */
        Ion.prototype.setElementStyle = function(property, value) {
            renderer.setStyle(this._elementRef.nativeElement, property, value);
        };

        FaIconComponentHelper.isInitialized = true;
    }
}
