import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerSuperPage } from './power-super.page';

describe('PowerSuperPage', () => {
  let component: PowerSuperPage;
  let fixture: ComponentFixture<PowerSuperPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PowerSuperPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PowerSuperPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
