import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { CarouselDisplayEnum } from 'src/app/shared/components/carousel/carousel.component';
import { EntiteChamp } from 'src/app/shared/entities/champ/entitechamp';
import { Produit } from 'src/app/shared/entities/produit';

@Component({
  selector: 'app-accessories',
  templateUrl: './accessories.component.html',
  styleUrls: ['./accessories.component.css']
})
export class AccessoriesComponent implements OnInit {
  @Input()
  products: Produit[] = [];
  @Input()
  champs: EntiteChamp[] = [];
  enum: CarouselDisplayEnum = CarouselDisplayEnum.ACCESSORIES;

  constructor() { }

  ngOnInit(): void {
  }

  clickControl(side: 'next' | 'prev') {
    side == 'prev' ? moveItemInArray(this.products, this.products.length - 1, 0)
      : moveItemInArray(this.products, 0, this.products.length - 1);
  }


}
