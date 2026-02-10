import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateDeuxColonneEditionComponent } from './template-deux-colonne-edition.component';

describe('TemplateDeuxColonneEditionComponent', () => {
  let component: TemplateDeuxColonneEditionComponent;
  let fixture: ComponentFixture<TemplateDeuxColonneEditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemplateDeuxColonneEditionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemplateDeuxColonneEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
