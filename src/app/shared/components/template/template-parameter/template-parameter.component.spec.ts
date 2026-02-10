import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateParameterComponent } from './template-parameter.component';

describe('TemplateBlockComponent', () => {
  let component: TemplateParameterComponent;
  let fixture: ComponentFixture<TemplateParameterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TemplateParameterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TemplateParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
