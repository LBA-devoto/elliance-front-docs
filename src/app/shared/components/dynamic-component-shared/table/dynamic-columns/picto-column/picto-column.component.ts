import { Component, OnInit, SimpleChanges, Input } from '@angular/core';
import { PictosUtils } from 'src/app/shared/utils/pictosUtils';

@Component({
  selector: 'app-picto-column',
  templateUrl: './picto-column.component.html',
  styleUrls: ['./picto-column.component.css'],
})
export class PictoColumnComponent implements OnInit {
  @Input() config: any;
  constructor() {}

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['config']) {
      this.config = changes['config'].currentValue;
    }
  }

  pictoNameToLabel(pictoName: string): string {
    return PictosUtils.toLabel(pictoName);
  }
}
