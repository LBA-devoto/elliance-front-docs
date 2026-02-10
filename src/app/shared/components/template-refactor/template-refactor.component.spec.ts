import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateRefactorComponent } from './template-refactor.component';

describe('TemplateRefactorComponent', () => {
  let component: TemplateRefactorComponent;
  let fixture: ComponentFixture<TemplateRefactorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemplateRefactorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemplateRefactorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
