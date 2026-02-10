import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModaleOrdreDevisComponent } from './modale-ordre-devis.component';

describe('ModaleOrdreDevisComponent', () => {
  let component: ModaleOrdreDevisComponent;
  let fixture: ComponentFixture<ModaleOrdreDevisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModaleOrdreDevisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModaleOrdreDevisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
