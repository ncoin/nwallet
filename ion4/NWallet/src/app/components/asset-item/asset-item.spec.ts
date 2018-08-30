import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetItemComponent } from './asset-item';

describe('AssetItemComponent', () => {
  let component: AssetItemComponent;
  let fixture: ComponentFixture<AssetItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
