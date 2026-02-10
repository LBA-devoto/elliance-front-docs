import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimitiveColumnComponent } from './primitive-column.component';

describe('PrimitiveColumnComponent', () => {
  let component: PrimitiveColumnComponent;
  let fixture: ComponentFixture<PrimitiveColumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrimitiveColumnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrimitiveColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
