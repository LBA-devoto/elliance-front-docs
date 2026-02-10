import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PictoColumnComponent } from './picto-column.component';

describe('PictoColumnComponent', () => {
  let component: PictoColumnComponent;
  let fixture: ComponentFixture<PictoColumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PictoColumnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PictoColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
