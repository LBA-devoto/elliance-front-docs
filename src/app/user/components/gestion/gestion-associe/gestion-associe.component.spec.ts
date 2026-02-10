import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionAssocieComponent } from './gestion-associe.component';

describe('GestionAssocieComponent', () => {
  let component: GestionAssocieComponent;
  let fixture: ComponentFixture<GestionAssocieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionAssocieComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionAssocieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
