import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrerChampComponent } from './filtrer-champ.component';

describe('ImportFichierComponent', () => {
  let component: FiltrerChampComponent;
  let fixture: ComponentFixture<FiltrerChampComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FiltrerChampComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiltrerChampComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
