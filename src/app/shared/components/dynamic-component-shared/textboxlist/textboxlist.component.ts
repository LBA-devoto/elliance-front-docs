import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { FormFieldConfig } from '../dropdown/form_field_config';
import { v4 as uuidv4 } from 'uuid';
import { UserService } from 'src/app/admin/core/services/user.service';

@Component({
  selector: 'app-textboxlist',
  templateUrl: './textboxlist.component.html',
  styleUrls: ['./textboxlist.component.css'],
})
export class TextboxlistComponent implements OnInit {
  @Input() config: FormFieldConfig;
  @Input() data: any;
  editMode: boolean = false;
  value: any = [];
  typeName: any;

  constructor(public userService: UserService) {}

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges) {
    if (changes['config']) {
      this.config = changes['config'].currentValue;
      this.value = this.config?.value;
      this.typeName = this.config.typeName;

      this.editMode = this.config.editMode;

      if (this.value == null) {
        this.value = [];
        this.addItem();
      }
    }
  }

  addItem() {
    this.value.push({ id: uuidv4() });
  }

  removeItem(index: number) {
    if (this.value.length > 1) this.value.splice(index, 1);
  }
}
