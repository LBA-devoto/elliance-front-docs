import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicDocumentManageFieldComponent } from './dynamic-document-manage-field.component';

describe('DynamicDocumentManageFieldComponent', () => {
  let component: DynamicDocumentManageFieldComponent;
  let fixture: ComponentFixture<DynamicDocumentManageFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicDocumentManageFieldComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicDocumentManageFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
