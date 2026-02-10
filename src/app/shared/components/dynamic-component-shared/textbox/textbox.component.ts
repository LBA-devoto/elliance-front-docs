import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { FormField } from '../form-field';
import { FormFieldConfig } from '../dropdown/form_field_config';
import { UserService } from 'src/app/admin/core/services/user.service';
import { TemplateService } from 'src/app/services/template.service';

@Component({
  selector: 'app-textbox',
  templateUrl: './textbox.component.html',
  styleUrls: ['./textbox.component.css'],
})
export class TextboxComponent implements OnInit {
  @Input() config: FormFieldConfig;
  @Input() data: any;
  editMode: boolean = false;
  value: any;
  typeName: any;

  constructor(public userService: UserService, public templateService:TemplateService) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['config']) {
      this.config = changes['config'].currentValue;
      this.value = this.config.value;
      this.editMode = this.config.editMode;
      this.typeName = this.config.typeName;
    }
  }

  get isColorHexa(): boolean {
    return this.config.name === 'valeurHexa';
  }

 
  
}
