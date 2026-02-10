import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FourHeaderComponent } from './four-header.component';

describe('FourHeaderComponent', () => {
  let component: FourHeaderComponent;
  let fixture: ComponentFixture<FourHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FourHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FourHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
