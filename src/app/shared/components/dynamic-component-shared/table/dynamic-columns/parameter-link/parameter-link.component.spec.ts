import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterLinkComponent } from './parameter-link.component';

describe('ParameterLinkComponent', () => {
  let component: ParameterLinkComponent;
  let fixture: ComponentFixture<ParameterLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParameterLinkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParameterLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
