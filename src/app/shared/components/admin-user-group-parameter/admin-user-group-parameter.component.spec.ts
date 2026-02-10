import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUserGroupParameterComponent } from './admin-user-group-parameter.component';

describe('AdminUserGroupParameterComponent', () => {
  let component: AdminUserGroupParameterComponent;
  let fixture: ComponentFixture<AdminUserGroupParameterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminUserGroupParameterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminUserGroupParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
