import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FourDashboardComponent } from './four-dashboard.component';

describe('FourDashboardComponent', () => {
  let component: FourDashboardComponent;
  let fixture: ComponentFixture<FourDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FourDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FourDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
