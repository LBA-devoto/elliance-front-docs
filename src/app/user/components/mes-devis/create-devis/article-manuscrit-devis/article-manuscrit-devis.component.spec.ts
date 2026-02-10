import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleManuscritDevisComponent } from './article-manuscrit-devis.component';

describe('ArticleManuscritDevisComponent', () => {
  let component: ArticleManuscritDevisComponent;
  let fixture: ComponentFixture<ArticleManuscritDevisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticleManuscritDevisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticleManuscritDevisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
