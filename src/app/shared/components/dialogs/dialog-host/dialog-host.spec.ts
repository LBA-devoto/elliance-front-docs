import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DiaologHostComponent } from './dialog-host';


describe('DiaologHostComponent', () => {
  let component: DiaologHostComponent;
  let fixture: ComponentFixture<DiaologHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiaologHostComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiaologHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
