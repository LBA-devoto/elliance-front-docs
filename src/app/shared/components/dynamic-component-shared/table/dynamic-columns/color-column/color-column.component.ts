import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-color-column',
  templateUrl: './color-column.component.html',
  styleUrls: ['./color-column.component.css'],
})
export class ColorColumnComponent implements OnInit {
  @Input() config: any;
  constructor() {}

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges) {
    if (changes['config']) {
      this.config = changes['config'].currentValue;
    }
  }

  isString(value: any): boolean {
    return typeof value === 'string';
  }
}
