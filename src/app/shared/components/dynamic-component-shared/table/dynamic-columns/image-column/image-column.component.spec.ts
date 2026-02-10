import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageColumnComponent } from './image-column.component';

describe('ImageColumnComponent', () => {
  let component: ImageColumnComponent;
  let fixture: ComponentFixture<ImageColumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageColumnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
