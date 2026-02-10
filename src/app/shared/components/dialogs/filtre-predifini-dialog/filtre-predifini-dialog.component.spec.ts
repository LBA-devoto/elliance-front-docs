import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrePredifiniDialogComponent } from './filtre-predifini-dialog.component';

describe('FiltrePredifiniDialogComponent', () => {
  let component: FiltrePredifiniDialogComponent;
  let fixture: ComponentFixture<FiltrePredifiniDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FiltrePredifiniDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiltrePredifiniDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
