import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultilangueColumnComponent } from './multilangue-column.component';

describe('MultilangueColumnComponent', () => {
  let component: MultilangueColumnComponent;
  let fixture: ComponentFixture<MultilangueColumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultilangueColumnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultilangueColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
