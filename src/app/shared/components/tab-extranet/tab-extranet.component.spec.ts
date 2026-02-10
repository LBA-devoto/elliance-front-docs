import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabExtranetComponent } from './tab-extranet.component';

describe('TabExtranetComponent', () => {
  let component: TabExtranetComponent;
  let fixture: ComponentFixture<TabExtranetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabExtranetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabExtranetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
