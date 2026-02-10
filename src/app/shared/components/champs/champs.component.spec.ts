import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChampsComponent } from './champs.component';

describe('ChampsComponent', () => {
  let component: ChampsComponent;
  let fixture: ComponentFixture<ChampsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChampsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChampsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
