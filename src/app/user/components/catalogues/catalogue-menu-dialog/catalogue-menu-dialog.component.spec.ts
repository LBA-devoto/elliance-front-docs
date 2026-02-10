import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogueMenuDialogComponent } from './catalogue-menu-dialog.component';

describe('CatalogueMenuDialogComponent', () => {
  let component: CatalogueMenuDialogComponent;
  let fixture: ComponentFixture<CatalogueMenuDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatalogueMenuDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogueMenuDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
