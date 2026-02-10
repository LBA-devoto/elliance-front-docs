import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormFieldConfig } from '../dropdown/form_field_config';

@Component({
  selector: 'app-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.css'],
})
export class LabelComponent implements OnInit {
  @Input() config: FormFieldConfig;
  constructor() {}

  ngOnInit(): void {
    
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['config']) {
      this.config.id = '4';
      this.config = changes['config'].currentValue;
    
    }
  }
}
