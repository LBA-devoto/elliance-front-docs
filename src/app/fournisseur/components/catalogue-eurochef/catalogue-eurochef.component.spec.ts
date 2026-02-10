import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogueEurochefComponent } from './catalogue-eurochef.component';

describe('CatalogueEurochefComponent', () => {
  let component: CatalogueEurochefComponent;
  let fixture: ComponentFixture<CatalogueEurochefComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatalogueEurochefComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogueEurochefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
