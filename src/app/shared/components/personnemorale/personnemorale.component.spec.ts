import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonMoraleComponent } from './personnemorale.component';

describe('PersonMoraleComponent', () => {
  let component: PersonMoraleComponent;
  let fixture: ComponentFixture<PersonMoraleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PersonMoraleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonMoraleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
