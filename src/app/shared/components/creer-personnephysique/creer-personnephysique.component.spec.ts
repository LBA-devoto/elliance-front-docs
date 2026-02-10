import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreerPersonnephysiqueComponent } from './creer-personnephysique.component';

describe('CreerPersonnephysiqueComponent', () => {
  let component: CreerPersonnephysiqueComponent;
  let fixture: ComponentFixture<CreerPersonnephysiqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreerPersonnephysiqueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreerPersonnephysiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
