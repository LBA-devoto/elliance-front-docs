import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FourAccueilComponent } from './four-accueil.component';

describe('FourAccueilComponent', () => {
  let component: FourAccueilComponent;
  let fixture: ComponentFixture<FourAccueilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FourAccueilComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FourAccueilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
