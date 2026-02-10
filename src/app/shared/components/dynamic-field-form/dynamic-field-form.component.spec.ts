import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicFieldFormComponent } from './dynamic-field-form.component';

describe('DynamicFieldFormComponent', () => {
  let component: DynamicFieldFormComponent;
  let fixture: ComponentFixture<DynamicFieldFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicFieldFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicFieldFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
