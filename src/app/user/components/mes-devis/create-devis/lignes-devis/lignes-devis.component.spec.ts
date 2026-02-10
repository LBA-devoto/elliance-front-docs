import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LignesDevisComponent } from './lignes-devis.component';

describe('LignesDevisComponent', () => {
  let component: LignesDevisComponent;
  let fixture: ComponentFixture<LignesDevisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LignesDevisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LignesDevisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
