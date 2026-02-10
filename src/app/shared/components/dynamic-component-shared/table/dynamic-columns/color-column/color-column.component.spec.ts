import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorColumnComponent } from './color-column.component';

describe('ColorColumnComponent', () => {
  let component: ColorColumnComponent;
  let fixture: ComponentFixture<ColorColumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColorColumnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColorColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
