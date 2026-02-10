import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DroitItemComponent } from './droit-item.component';

describe('DroitItemComponent', () => {
  let component: DroitItemComponent;
  let fixture: ComponentFixture<DroitItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DroitItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DroitItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
