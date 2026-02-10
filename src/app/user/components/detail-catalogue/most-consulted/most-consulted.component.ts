import { Component, Input, OnInit } from '@angular/core';
import { CarouselDisplayEnum } from 'src/app/shared/components/carousel/carousel.component';
import { EntiteChamp } from 'src/app/shared/entities/champ/entitechamp';
import { Produit } from 'src/app/shared/entities/produit';

@Component({
  selector: 'app-most-consulted',
  templateUrl: './most-consulted.component.html',
  styleUrls: ['./most-consulted.component.css']
})
export class MostConsultedComponent implements OnInit {


  @Input()
  products: Produit[] = [];
  @Input()
  champs: EntiteChamp[] = [];
  enum: CarouselDisplayEnum = CarouselDisplayEnum.PRODUCTS;

  constructor() { }

  ngOnInit(): void {
  }

}
