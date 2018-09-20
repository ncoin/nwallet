import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntrancePage } from './entrance.page';

describe('EntrancePage', () => {
    let component: EntrancePage;
    let fixture: ComponentFixture<EntrancePage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EntrancePage],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EntrancePage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
