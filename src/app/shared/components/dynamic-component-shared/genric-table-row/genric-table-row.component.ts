import { I } from '@angular/cdk/keycodes';
import {
  Component,
  OnInit,
  Input,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-genric-table-column',
  templateUrl: './genric-table-row.component.html',
  styleUrls: ['./genric-table-row.component.css'],
})
export class GenricTableRowComponent implements OnInit {
  @Input() column: any;
  @Input() columnDefs: any;
  displayValue: any;
  config: any;
  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['column']) {
      this.column = changes['column'].currentValue;
    }
    if (changes['columnDefs']) {
      this.columnDefs = changes['columnDefs'].currentValue;
    }

    if (this.column && this.columnDefs) {
      this.config = this.columnDefs.find((x: any) => x.field === this.column);
      this.displayValue = this.column[this.config.displayProperty];
    }
  }
}
