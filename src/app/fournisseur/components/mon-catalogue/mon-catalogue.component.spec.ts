import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonCatalogueComponent } from './mon-catalogue.component';

describe('MonCatalogueComponent', () => {
  let component: MonCatalogueComponent;
  let fixture: ComponentFixture<MonCatalogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonCatalogueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonCatalogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
