import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonEspaceComponent } from './mon-espace.component';

describe('MonEspaceComponent', () => {
  let component: MonEspaceComponent;
  let fixture: ComponentFixture<MonEspaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonEspaceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonEspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
