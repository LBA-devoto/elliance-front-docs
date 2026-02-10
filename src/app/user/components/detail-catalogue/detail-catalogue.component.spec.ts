import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailCatalogueComponent } from './detail-catalogue.component';

describe('DetailCatalogueComponent', () => {
  let component: DetailCatalogueComponent;
  let fixture: ComponentFixture<DetailCatalogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailCatalogueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailCatalogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
