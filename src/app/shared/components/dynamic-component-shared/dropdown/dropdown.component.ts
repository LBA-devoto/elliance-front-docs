import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { FormFieldConfig } from './form_field_config';
import { HttpclientService } from 'src/app/admin/core/services/httpclientService';
import { HttpClient } from '@angular/common/http';
import { TemplateService } from 'src/app/services/template.service';
import { UserService } from 'src/app/admin/core/services/user.service';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css'],
})
export class DropdownComponent implements OnInit {
  @Input() config: FormFieldConfig;
  @Input() data: any;
  value: any = {};
  dropdownList: any = [];
  simpleMode = false;
  typeName: any;

  constructor(
    private templateService: TemplateService,
    public userService: UserService
  ) {}

  ngOnInit(): void {
    if (this.config.simpleMode) {
      this.simpleMode = true;
    } else {
      // make a call to the bacend to get the dropdown values
      this.populateDropdown();
    }
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
  compareValeurs(o1: any, o2: any): boolean {
    if (o1 && o2) {
      return o1.id === o2.id;
    }
    return false;
  }

  populateDropdown() {

    if (this.config.entiteClassSelection) {
      this.populateFromEntite();
    } else if (this.config.parametreName) {
      this.populateFromParametre();
    }
  }

  // populateFromParametre() {
  //   this.templateService
  //     .getDropDownValues(`parametre/nomtable/${this.config.parametreName}`)
  //     .subscribe((data) => {
  //       this.config.dropdownList = data;
  //     });
  // }

  populateFromParametre() {
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
  
  populateFromEntite() {
    this.templateService
      .getDropDownValues(`/${this.config.entity.toLocaleLowerCase()}/`)
      .subscribe((data) => {
        this.config.dropdownList = data;

      });
  }
}
