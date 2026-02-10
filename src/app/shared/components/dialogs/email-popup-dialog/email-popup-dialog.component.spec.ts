import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailPopupDialogComponent } from './email-popup-dialog.component';

describe('EmailPopupDialogComponent', () => {
  let component: EmailPopupDialogComponent;
  let fixture: ComponentFixture<EmailPopupDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailPopupDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailPopupDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
