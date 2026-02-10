import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CguPopupComponent } from './cgu-popup.component';

describe('CguPopupComponent', () => {
  let component: CguPopupComponent;
  let fixture: ComponentFixture<CguPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CguPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CguPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
