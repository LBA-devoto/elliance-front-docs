import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaracProductComponent } from './carac-product.component';

describe('CaracProductComponent', () => {
  let component: CaracProductComponent;
  let fixture: ComponentFixture<CaracProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaracProductComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaracProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
