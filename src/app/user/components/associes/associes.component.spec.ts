import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociesComponent } from './associes.component';

describe('AssociesComponent', () => {
  let component: AssociesComponent;
  let fixture: ComponentFixture<AssociesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssociesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssociesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
