import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfosDevisComponent } from './infos-devis.component';

describe('InfosDevisComponent', () => {
  let component: InfosDevisComponent;
  let fixture: ComponentFixture<InfosDevisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfosDevisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfosDevisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
