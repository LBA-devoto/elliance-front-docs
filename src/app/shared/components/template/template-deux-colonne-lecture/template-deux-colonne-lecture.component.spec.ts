import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateDeuxColonneLectureComponent } from './template-deux-colonne-lecture.component';

describe('TemplateDeuxColonneLectureComponent', () => {
  let component: TemplateDeuxColonneLectureComponent;
  let fixture: ComponentFixture<TemplateDeuxColonneLectureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemplateDeuxColonneLectureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemplateDeuxColonneLectureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
