import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutilsDevisComponent } from './outils-devis.component';

describe('OutilsDevisComponent', () => {
  let component: OutilsDevisComponent;
  let fixture: ComponentFixture<OutilsDevisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutilsDevisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutilsDevisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
