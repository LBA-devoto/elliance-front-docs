import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenricTableRowComponent } from './genric-table-row.component';

describe('GenricTableRowComponent', () => {
  let component: GenricTableRowComponent;
  let fixture: ComponentFixture<GenricTableRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenricTableRowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenricTableRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
