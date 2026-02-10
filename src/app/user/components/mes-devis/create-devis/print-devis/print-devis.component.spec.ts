import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintDevisComponent } from './print-devis.component';

describe('PrintDevisComponent', () => {
  let component: PrintDevisComponent;
  let fixture: ComponentFixture<PrintDevisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintDevisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintDevisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
