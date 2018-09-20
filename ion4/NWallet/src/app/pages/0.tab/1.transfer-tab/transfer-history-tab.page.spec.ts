import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferHistoryTabPage } from './transfer-history-tab.page';

describe('TransferHistoryTabPage', () => {
    let component: TransferHistoryTabPage;
    let fixture: ComponentFixture<TransferHistoryTabPage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TransferHistoryTabPage],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TransferHistoryTabPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
