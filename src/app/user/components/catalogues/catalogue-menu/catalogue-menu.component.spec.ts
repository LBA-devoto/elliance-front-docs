import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogueMenuComponent } from './catalogue-menu.component';

describe('CatalogueMenuComponent', () => {
  let component: CatalogueMenuComponent;
  let fixture: ComponentFixture<CatalogueMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatalogueMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogueMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
