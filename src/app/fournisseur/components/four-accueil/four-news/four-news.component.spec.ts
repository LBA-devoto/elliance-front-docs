import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FourNewsComponent } from './four-news.component';

describe('FourNewsComponent', () => {
  let component: FourNewsComponent;
  let fixture: ComponentFixture<FourNewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FourNewsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FourNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
