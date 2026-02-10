import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Image } from 'src/app/shared/entities/image';

@Component({
  selector: 'app-image-column',
  templateUrl: './image-column.component.html',
  styleUrls: ['./image-column.component.css'],
})
export class ImageColumnComponent implements OnInit {
  @Input() config: any;
  image: any = {};
  imagesMap: { [key: string]: Image } = {};
  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['config']) {
      this.config = changes['config'].currentValue;
      if (this.config.imagesmap) {
        this.imagesMap = this.config?.imagesmap;
      }
      if (this.config.value) {
        this.image = this.config?.value;
      }
    }
  }
}
