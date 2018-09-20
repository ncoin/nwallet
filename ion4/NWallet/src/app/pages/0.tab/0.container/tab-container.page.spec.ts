import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabcontainerPage } from './tab-container.page';

describe('TabcontainerPage', () => {
    let component: TabcontainerPage;
    let fixture: ComponentFixture<TabcontainerPage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TabcontainerPage],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TabcontainerPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
