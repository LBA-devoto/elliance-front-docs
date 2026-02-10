import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectColumnComponent } from './object-column.component';

describe('ObjectColumnComponent', () => {
  let component: ObjectColumnComponent;
  let fixture: ComponentFixture<ObjectColumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObjectColumnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObjectColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
