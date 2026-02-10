import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogueMenuRespComponent } from './catalogue-menu-resp.component';

describe('CatalogueMenuRespComponent', () => {
  let component: CatalogueMenuRespComponent;
  let fixture: ComponentFixture<CatalogueMenuRespComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatalogueMenuRespComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogueMenuRespComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
