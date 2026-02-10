import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CarouselDisplayEnum } from 'src/app/shared/components/carousel/carousel.component';
import { Actualite } from 'src/app/shared/entities/actualite';
import { ActualityService } from 'src/app/shared/services/actuality.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  newsCards: Actualite[] = [];
  activeIndex = 0;
  enum: CarouselDisplayEnum = CarouselDisplayEnum.NEWS;
  @Output()
  hasNews: EventEmitter<boolean> = new EventEmitter();

  get noNews() {
    return this.newsCards.length === 0;
  }

  constructor(private actuService: ActualityService) { }

  ngOnInit(): void {
    this.loadNews();
  }

  loadNews() {
    this.actuService.getActualities().then((actus) => {
      this.newsCards = actus;    
      this.hasNews.emit(this.newsCards?.length > 0 ? this.newsCards?.length > 0 : false);      
    }).catch(() => {
      this.hasNews.emit(false);   
    })
  }

  clickControl(side: 'next' | 'prev') {
    side == 'prev' ? moveItemInArray(this.newsCards, this.newsCards.length - 1, 0)
      : moveItemInArray(this.newsCards, 0, this.newsCards.length - 1);
  }

}
