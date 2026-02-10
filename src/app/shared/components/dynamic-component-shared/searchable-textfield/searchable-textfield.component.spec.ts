import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchableTextfieldComponent } from './searchable-textfield.component';

describe('SearchableTextfieldComponent', () => {
  let component: SearchableTextfieldComponent;
  let fixture: ComponentFixture<SearchableTextfieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchableTextfieldComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchableTextfieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
