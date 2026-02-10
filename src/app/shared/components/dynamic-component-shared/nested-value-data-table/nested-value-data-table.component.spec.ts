import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NestedValueDataTableComponent } from './nested-value-data-table.component';

describe('NestedValueDataTableComponent', () => {
  let component: NestedValueDataTableComponent;
  let fixture: ComponentFixture<NestedValueDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NestedValueDataTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NestedValueDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
