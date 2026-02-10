import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostConsultedComponent } from './most-consulted.component';

describe('MostConsultedComponent', () => {
  let component: MostConsultedComponent;
  let fixture: ComponentFixture<MostConsultedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MostConsultedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MostConsultedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
