import { AfterContentChecked, Component, Input, OnInit } from '@angular/core';
import { EntiteChamp } from '../../entities/champ/entitechamp';

export enum CarouselDisplayEnum {
  NEWS = 'actu',
  PRODUCTS = 'produits',
  ACCESSORIES = 'accessoires',
  OPTIONS = 'options',
}

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit, AfterContentChecked{
  @Input()
  elements: any[] = [];

  @Input()
  display: CarouselDisplayEnum = CarouselDisplayEnum.NEWS;

  @Input()
  champs: EntiteChamp[] = [];

  loaded = false;
  carousel: any;
  carouselWidth = 0;
  cardWidth = 0;
  scrollPosition = 0;

  displayProducts = true; // Pour comparer si c'est une actu ou un produit
  hitMaxDetected = false;

  defaultImg = '/assets/images/Pas-dimage-disponible.jpg';

  get hitMax() {
    return this.carouselWidth < window.innerWidth || this.hitMaxDetected;
  }

  get hitMin() {
    return this.scrollPosition <= 0;
  }

  constructor() {
  }

  ngOnInit(): void {
    this.setCarousel();
  }

  ngAfterContentChecked(): void {
    let car = document.getElementById(this.display);
    let card = document.getElementsByClassName(`carousel-item`);
    
    if (!this.loaded && car && card.length>0) {
      this.carousel = car;
      this.carouselWidth = this.carousel.scrollWidth;
      let cardWidth = card[0].scrollWidth;
      this.cardWidth = cardWidth ? cardWidth : 308;
      this.loaded = true;
      this.setObserver();
    }
  }

  setObserver() {
    const ob = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry: IntersectionObserverEntry) => {
        if (entry.isIntersecting) {
          this.hitMaxDetected = true;
        } else {
          this.hitMaxDetected = false;
        }
      });
    });

    // Start observing a target element
    const target = document.getElementById(`${this.display}-last`);

    if (target) ob.observe(target);
  }

  setCarousel() {    
    if (this.elements[0].lienExtern) { // Si c'est une actualité
      this.displayProducts = false;
    }
  }

  clickControl(side: 'next' | 'prev') {
    this.hitMaxDetected = false;
    this.scrollPosition += side == 'next' ? this.cardWidth : -this.cardWidth;

    if (this.hitMin) {
      this.scrollPosition = 0;
    } else if (this.hitMax) {
      this.scrollPosition = (this.carouselWidth - window.innerWidth) + 1;
    }

    this.carousel?.scrollTo({ left: this.scrollPosition, behavior: 'smooth' });
  }

  imgErr(index: number) {
    this.elements[index].image.url = this.defaultImg;
  }
}
