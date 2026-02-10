import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { FormFieldConfig } from '../dropdown/form_field_config';
import { HttpClient } from '@angular/common/http';
import { SelectionModel } from '@angular/cdk/collections';
import {
  debounceTime,
  tap,
  switchMap,
  finalize,
  distinctUntilChanged,
  filter,
} from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { HttpclientService } from 'src/app/admin/core/services/httpclientService';
import { Parametre } from 'src/app/shared/entities/parametre';
import { Tables } from 'src/app/shared/entities/tables';
import { MatDialog } from '@angular/material/dialog';
import { DiaologHostComponent } from '../../dialogs/dialog-host/dialog-host';
import { DashboardComponent } from 'src/app/admin/core/components/dashboard/dashboard.component';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { UserService } from 'src/app/admin/core/services/user.service';

@Component({
  selector: 'app-searchable-textfield',
  templateUrl: './searchable-textfield.component.html',
  styleUrls: ['./searchable-textfield.component.css'],
})
export class SearchableTextfieldComponent implements OnInit {
  @Input() config: FormFieldConfig;
  @Input() data: any;
  editMode: boolean = false;
  value: any;
  entite: any;
  isWholeEntite = false;
  entiteRelationProperte: any;
  filteredArticles: any;
  typeName: any;

  minLengthTerm = 1;
  pageIndex: number = 1;
  pageSize: number = 100;
  searchArticlesCtrl = new FormControl();
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

      this.entiteRelationProperte = this.config.entiteRelationProperte;
      if (this.config.entiteRelationProperte === this.config.linkedEntite) {
        this.isWholeEntite = true; // on a toute l'entite dans la liste
      }

      this.entite = this.config.linkedEntite;
     
      this.value = this.config.value;
     

      // Set the value to the selected option
      if (this.config.value) {
        this.searchArticlesCtrl.setValue(
          this.config.value[this.config.searchableFields[0]] // this is the field to display
        );
      }
    }
  }

  // autocompleteSearch(event: any) {
  //   this.searchArticlesCtrl.valueChanges
  //     .pipe(
  //       filter((res) => {
  //         return (
  //           res !== null &&
  //           res !== undefined &&
  //           res.length >= this.minLengthTerm
  //         );
  //       }),
  //       distinctUntilChanged(),
  //       debounceTime(300),
  //       tap(() => {
  //         this.filteredArticles = [];
  //       }),
  //       switchMap((value) =>
  //         this.httpClient.get(
  //           `view/autocomplete?entite=${this.entite}&q=${value}&page=${this.pageIndex}&size=${this.pageSize}`
  //         )
  //       )
  //     )
  //     .subscribe((res: any) => {
  //       this.filteredArticles = res.content;
  //     });
  // }

  autocompleteSearch(event: any) {
    this.searchArticlesCtrl.valueChanges
      .pipe(
        filter((res) => {
          return (
            res !== null &&
            res !== undefined &&
            res.length >= this.minLengthTerm
          );
        }),
        distinctUntilChanged(),
        debounceTime(300),
        tap(() => {
          this.filteredArticles = [];
        }),
        switchMap((value) =>
          this.httpClient.get(
            `view/autocomplete?entite=${this.entite}&q=${value}&page=${this.pageIndex}&size=${this.pageSize}`
          )
        )
      )
      .subscribe((res: any) => {
        this.filteredArticles = res.content;
        // First sort by length, then by alphabetical order
        this.filteredArticles.sort((a: any, b: any) => {
          const aLength = a[this.config.searchableFields[0]]?.length || 0;
          const bLength = b[this.config.searchableFields[0]]?.length || 0;
  
          // If lengths are equal, sort alphabetically
          if (aLength === bLength) {
            const aValue = a[this.config.searchableFields[0]]?.toLowerCase() || '';
            const bValue = b[this.config.searchableFields[0]]?.toLowerCase() || '';
            if (aValue < bValue) {
              return -1;
            }
            if (aValue > bValue) {
              return 1;
            }
            return 0; // If equal
          }
          // Otherwise, sort by length
          return aLength - bLength;
        });
      });
  }
  
  onAutocompleteOptionSelected(entite: any) {
    this.config.value = entite;
    // Check if config.value is null
    if (!this.config.value) {
      this.config.value = {}; // Create an empty object if it is null
    }

    // Set the value to the selected option
    this.config.value[this.config.searchableFields[0]] =
      entite[this.config.searchableFields[0]];
    this.searchArticlesCtrl.setValue(entite[this.config.searchableFields[0]]);
  }

  ouvrirOnglet(data: any) {
    let nom = data[this.config.searchableFields[0]];

    this.dash.visualisation(
      nom,
      this.entite,
      `${data.id}`,
      '',
      100,
      this.config.menu
    );
  }
}
