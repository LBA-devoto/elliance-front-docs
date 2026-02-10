import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportFichierComponent } from './export-fichier.component';

describe('ExportFichierComponent', () => {
  let component: ExportFichierComponent;
  let fixture: ComponentFixture<ExportFichierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportFichierComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportFichierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
