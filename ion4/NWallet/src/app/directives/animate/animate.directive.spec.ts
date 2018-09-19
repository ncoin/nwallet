import { TestBed } from '@angular/core/testing';
import { AnimateDirective } from './animate.directive';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

@Component({
    template: `<input type="text" animate>`
})
class TestHoverFocusComponent {}

describe('AnimateDirective', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [AnimateDirective]
        });
    });

    it('should create an instance', () => {
        const fixture = TestBed.createComponent(TestHoverFocusComponent);
        const component = fixture.componentInstance;
        const inputEl = fixture.debugElement.query(By.css('input'));

        expect(component).toBeTruthy();
    });
});
