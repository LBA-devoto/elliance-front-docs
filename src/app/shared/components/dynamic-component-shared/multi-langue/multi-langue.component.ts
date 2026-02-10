import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormFieldConfig } from '../dropdown/form_field_config';
import { Language } from '../../../entities/language';
import { UserService } from 'src/app/admin/core/services/user.service';

@Component({
  selector: 'app-multi-langue',
  templateUrl: './multi-langue.component.html',
  styleUrls: ['./multi-langue.component.css'],
})
export class MultiLangueComponent implements OnInit {
  @Input() config: FormFieldConfig;
  @Input() data: any;
  @Input() languages: Language[];
  typeName: any;

  value: any = {};
  multilangueMap: { [key: string]: any } = {};

  constructor(public userService: UserService) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['config']) {
      this.config.id = '4';
      this.config = changes['config'].currentValue;

      if (this.config.value) {
        this.multilangueMap = this.config.value;
      }
      this.typeName = this.config.typeName;
    }
  }

  isLocal(local: string): boolean {
    return (
      this.languages?.find((l) => l.key === local && l.selected) !== undefined
    );
  }

  sanitizeLabel(label: string): string {
  if (!label) return '';
  return label.replace(/�/g, '°');
}
}

