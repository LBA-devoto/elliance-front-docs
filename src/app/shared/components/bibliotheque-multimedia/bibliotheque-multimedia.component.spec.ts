import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BibliothequeMultimediaComponent } from './bibliotheque-multimedia.component';

describe('BibliothequeMultimediaComponent', () => {
  let component: BibliothequeMultimediaComponent;
  let fixture: ComponentFixture<BibliothequeMultimediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BibliothequeMultimediaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BibliothequeMultimediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
