import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiLangueComponent } from './multi-langue.component';

describe('MultiLangueComponent', () => {
  let component: MultiLangueComponent;
  let fixture: ComponentFixture<MultiLangueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiLangueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiLangueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
