
import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { FormFieldConfig } from '../dropdown/form_field_config';
import { TemplateService } from 'src/app/services/template.service';
import { UserService } from 'src/app/admin/core/services/user.service';

@Component({
  selector: 'app-multi-select-dropdown',
  templateUrl: './multi-select-dropdown.component.html',
  styleUrls: ['./multi-select-dropdown.component.css'],
})
export class MultiSelectDropdownComponent implements OnInit {
  @Input() config: FormFieldConfig;
  @Input() data: any;
  value: any = {};
  dropdownList: any = [];
  typeName: any;

  constructor(
    private templateService: TemplateService,
    public userService: UserService
  ) {}

  ngOnInit(): void {
    // make a call to the backend to get the dropdown values
    this.populateDropdown();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['config']) {
      this.config.id = '4';
      this.config = changes['config'].currentValue;
      this.typeName = this.config.typeName;
      if (this.config.value) {
        this.value = this.config.value;
      }
    }
  }

  // populateDropdown() {
  //   this.templateService
  //     .getDropDownValues(`parametre/nomtable/${this.config.parametreName}`)
  //     .subscribe((data) => {
  //       this.config.dropdownList = data;
      
 
  //     });
  // }
  populateDropdown() {
    this.templateService
      .getDropDownValues(`parametre/nomtable/${this.config.parametreName}`)
      .subscribe((data) => {
        this.config.dropdownList = data.sort((a: any, b: any) => {
          const labelA = a.mapLocalLibelle?.fr_FR?.toLowerCase() || '';
          const labelB = b.mapLocalLibelle?.fr_FR?.toLowerCase() || '';
          return labelA.localeCompare(labelB);
        });
      });
  }
  compareValeurs(o1: any, o2: any): boolean {
    if (o1 && o2) {
      return o1.id === o2.id;
    }
    return false;
  }
}
