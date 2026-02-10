import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextboxlistComponent } from './textboxlist.component';

describe('TextboxlistComponent', () => {
  let component: TextboxlistComponent;
  let fixture: ComponentFixture<TextboxlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextboxlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextboxlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
