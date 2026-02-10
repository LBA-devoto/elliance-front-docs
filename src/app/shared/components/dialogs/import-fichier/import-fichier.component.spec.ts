import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportFichierComponent } from './import-fichier.component';

describe('ImportFichierComponent', () => {
  let component: ImportFichierComponent;
  let fixture: ComponentFixture<ImportFichierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportFichierComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportFichierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
