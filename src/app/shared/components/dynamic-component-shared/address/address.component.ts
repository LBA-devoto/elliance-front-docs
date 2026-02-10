import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import {
  debounceTime,
  tap,
  switchMap,
  finalize,
  distinctUntilChanged,
  filter,
} from 'rxjs/operators';
import { FormFieldConfig } from '../dropdown/form_field_config';
import { FormControl } from '@angular/forms';
import { HttpclientService } from 'src/app/admin/core/services/httpclientService';
import { Parametre } from 'src/app/shared/entities/parametre';
import { Tables } from 'src/app/shared/entities/tables';
import { MatDialog } from '@angular/material/dialog';
import { DiaologHostComponent } from '../../dialogs/dialog-host/dialog-host';
import { DashboardComponent } from 'src/app/admin/core/components/dashboard/dashboard.component';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { HttpClient } from '@angular/common/http';
import { CodepostalDto } from 'src/app/shared/entities/codepostal-dto';
import { Addresse } from 'src/app/shared/entities/addresse';
import { v4 as uuidv4 } from 'uuid';
import { AddresseDto } from 'src/app/shared/entities/adresse-dto';
import { UserService } from 'src/app/admin/core/services/user.service';
@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css'],
})
export class AddressComponent implements OnInit {
  @Input() config: FormFieldConfig;
  @Input() data: any;
  editMode: boolean = false;
  value: any;
  entite: any;
  ville: any;
  filteredArticles: any;
  minLengthTerm = 1;
  pageIndex: number = 1;
  pageSize: number = 10;
  vilformCtrl = new FormControl();
  codePostalCtrl = new FormControl();
  addressligneCtrl = new FormControl();
  codePostal: any;
  addressLigne: any;
  typeName: any;
  constructor(
    private httpClient: HttpClient,
    private dash: DashboardComponent,
    public userService: UserService
  ) {}

  ngOnInit(): void {
    this.editMode = this.config.editMode;
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['config']) {
      this.config.id = '4';
      this.config = changes['config'].currentValue;
      this.typeName = this.config.typeName;

      this.value = this.config.value;
      if (this.value) {
        this.codePostalCtrl.setValue(this.value[0].codepostal?.valeur);
        this.addressligneCtrl.setValue(this.value[0].adresseligne?.[0]);
        this.vilformCtrl.setValue(this.value[0].ville?.nom);
      }
    }
  }

  autocompleteSearch(event: any) {
    this.vilformCtrl.valueChanges
      .pipe(
        filter((res) => {
          return (
            res !== null &&
            res !== undefined &&
            res.length >= this.minLengthTerm
          );
        }),
        distinctUntilChanged(),
        debounceTime(100),
        tap(() => {
          this.filteredArticles = [];
        }),
        switchMap((value) =>
          this.httpClient.get(
            `view/autocomplete?entite=ville&q=${value}&page=${this.pageIndex}&size=${this.pageSize}`
          )
        )
      )
      .subscribe((res: any) => {
        this.filteredArticles = res.content;
      });
  }

  onAutocompleteOptionSelected(entite: any) {
    this.config.value = entite;
    this.ville = entite;
    // Check if config.value is null
    if (!this.config.value) {
      this.config.value = {}; // Create an empty object if it is null
    }

    // Set the value to the selected option
    this.config.value[this.config.searchableFields[0]] =
      entite[this.config.searchableFields[0]];

    this.codePostal = entite.codepostal;
    this.codePostalCtrl.setValue(this.codePostal?.valeur);
    this.vilformCtrl.setValue(entite.nom);
  }

  getAddressLigne(): any {
    let codePostal = new CodepostalDto();
    codePostal.valeur = this.codePostalCtrl.value;
    codePostal.id = uuidv4();
    let addressLigne = this.addressligneCtrl.value;

    let address = {
      codepostal: codePostal,
      adresseligne: [addressLigne],
      ville: this.ville,
    };
    return [address];
  }
}
