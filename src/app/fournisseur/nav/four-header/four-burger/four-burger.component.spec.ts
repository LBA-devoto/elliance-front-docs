import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FourBurgerComponent } from './four-burger.component';

describe('FourBurgerComponent', () => {
  let component: FourBurgerComponent;
  let fixture: ComponentFixture<FourBurgerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FourBurgerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FourBurgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
