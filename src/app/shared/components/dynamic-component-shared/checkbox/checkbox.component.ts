import { Component, OnInit, Input } from '@angular/core';
import { HttpclientService } from 'src/app/admin/core/services/httpclientService';
import { FormFieldConfig } from '../dropdown/form_field_config';
import { SelectionModel } from '@angular/cdk/collections';
import { UserService } from 'src/app/admin/core/services/user.service';
import { type } from 'os';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.css'],
})
export class CheckboxComponent implements OnInit {
  @Input() config: FormFieldConfig;
  selectedCheckboxValues: any[] = [];
  typeName: any;

  @Input() data: any;
  checkboxOptions: any[] = [];

  constructor(private httpClient: HttpclientService, public userService:UserService) {}

  ngOnInit(): void {
    if (this.config.checkboxOptions) {
      this.checkboxOptions = this.config.checkboxOptions;
    } else {
      this.getCheckboxOptions();
    }
    this.typeName = this.config.typeName;
    // this is when no data is passed from parent component
  }
  handleCheckboxChange(value: any) {
    if (this.isSelectedCheckbox(value)) {
      // Checkbox is being unchecked, remove the value from selectedCheckboxValues
      const index = this.selectedCheckboxValues.indexOf(value);
      if (index !== -1) {
        this.selectedCheckboxValues.splice(index, 1);
      }
    } else {
      this.selectedCheckboxValues.push(value);
    }
  }

  isSelectedCheckbox(value: any) {
    return this.selectedCheckboxValues.includes(value);
  }

  getCheckboxOptions() {
    let checkBoxEntiteUrl = `${this.config.checkBoxEntite}/`;

    this.httpClient
      .get(checkBoxEntiteUrl)
      .subscribe((data: any) => (this.checkboxOptions = data));
  }
}
