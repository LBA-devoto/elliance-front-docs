import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { FormFieldConfig } from '../dropdown/form_field_config';
import { SelectionModel } from '@angular/cdk/collections';
import {
  debounceTime,
  tap,
  switchMap,
  distinctUntilChanged,
  filter,
} from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { HttpclientService } from 'src/app/admin/core/services/httpclientService';
import { Parametre } from 'src/app/shared/entities/parametre';
import { Tables } from 'src/app/shared/entities/tables';
import { MatDialog } from '@angular/material/dialog';
import { DashboardComponent } from 'src/app/admin/core/components/dashboard/dashboard.component';
import { UserService } from 'src/app/admin/core/services/user.service';
import { type } from 'os';
import { ChangeDetectionStrategy } from '@angular/compiler';
import { Language } from 'src/app/shared/entities/language';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css'],
})
export class DataTableComponent implements OnInit {
  datasource: MatTableDataSource<any> = new MatTableDataSource<any>();
  autocomplete: any;
  displayedColumns: string[] = ['delete'];
  pageIndex: number = 1;
  pageSize: number = 100000;
  filters: any = {};
  entite: any;
  tab: Tables = new Tables();
  parameters: Parametre[];
  entiteRelationProperte: any;
  @Input() config: FormFieldConfig;
  selection = new SelectionModel<any>(true, []);
  clickSelection = new Set<any>();
  recherche: any;
  minLengthTerm = 3;
  searchArticlesCtrl = new FormControl();
  filteredArticles: any;
  selectedArticle: any;
  isWholeEntite = false;
  visible = true;
  languges: Language[] = [];
  nom: any;
  @Input()
  locales: string[];

  typeName: any = '';

  get onlyOneValue(): boolean {
    return (
      (this.entite == 'user' || this.entite == 'personnemorale') &&
      this.datasource.data.length == 1
    );
  }

  get hideAutocomplete(): boolean {
    return this.entite == 'personnephysique';
  }

  get cantDelete(): boolean {
    return this.entite == 'personnephysique';
  }

  constructor(
    private httpClient: HttpClient,
    private httpClientService: HttpclientService,
    private dialog: MatDialog,
    private dash: DashboardComponent,
    public userService: UserService
  ) {}

  ngOnInit(): void {
    this.populateTable();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.locales = changes['locales'].currentValue;

    if (changes['config']) {
      this.config.id = '4';
      this.config = changes['config'].currentValue;

      this.displayedColumns = this.config.displayedColumns;
    
     
      if (this.config.displayedColumns.indexOf('delete') === -1) {
        this.displayedColumns.push('delete');
      }
      this.entiteRelationProperte = this.config.entiteRelationProperte;
      if (
        this.config?.entiteRelationProperte?.toLocaleLowerCase() ===
        this.config?.linkedEntite?.toLocaleLowerCase()
      ) {
        this.isWholeEntite = true; // on a toute l'entite dans la
      }
      this.entite = this.config.linkedEntite;
      this.config.typeName = this.config.typeName;
    }

  }
  suprimme(row: any) {
    this.config.idList = this.config?.idList.filter(
      (item) => row?.id !== null && item !== row?.id
    );
    this.config.entiteList = this.config?.entiteList.filter(
      (item) => item !== row
    );
    this.datasource.data = this.datasource.data.filter((item) => item !== row);
  }

  filtreMotCles(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.datasource.filter = filterValue.trim().toLowerCase();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.datasource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.datasource.data);
  }

  checkboxLabel(element?: any): string {
    if (!element) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(element) ? 'deselect' : 'select'} row ${
      element.id + 1
    }`;
  }

  populateTable() {
    if (this.filters === undefined || this.filters === null) {
      this.filters = [];
    } else if (Array.isArray(this.filters)) {
      for (let filter of this.filters) {
        this.filters[filter.champ] = filter;
      }
    }
   
    if (
      !this.isWholeEntite &&
      this.config.idList &&
      this.config.idList.length > 0
    ) {
      // si on a des id
      this.getData();
    } else if(!this.isWholeEntite &&
      this.config.idList &&
      this.config.idList.length == 0 && this.config.linkedEntite =="Adaptationplaque")
      {

        console.log(this.config);
      }
     else if (
      this.isWholeEntite &&
      this.config.entiteList &&
      this.config.entiteList.length > 0
    ) {
      // si on a des id
      this.datasource.data.push(...this.config.entiteList);
      console.log(this.config.entiteList)
    }
  }

  getData() {
    if (this.config.idList) {
      console.log(this.config.idList)
      this.config.idList = this.config.idList.filter((x) => x !== null);
      if (typeof this.config.idList[0] !== 'string') {
        this.config.idList = this.config.idList.map((item) => item.id);
      }
      this.httpClient

        .post<any[]>(
          `/view/filtrerById/${this.entite.toLowerCase()}`,
          this.config.idList
        )
        .subscribe((data: any) => {
          this.datasource.data = data.response;
         
        });
    }
  }

  getValue(val: any) {
    return val?.titre
      ? val?.titre
      : val?.email
      ? val?.email
      : val?.nom
      ? val?.nom
      : val?.name
      ? val?.name
      : val?.code
      ? val?.code
      : val?.famille
      ? val?.famille
      : val?.label
      ? val?.label[this.locales[0]]
      : val;
  }

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
        switchMap((value) => {
        
          return this.httpClientService.post(
            {
              entite: this.entite,
              query: value,
              filter: this.config.filter,
              page: this.pageIndex,
              size: this.pageSize,
            },
            'view/autocompletepost'
          );
        })
      )
      .subscribe((res: any) => {
        this.filteredArticles = res.content;
      });
  }

  verifycolumnData(columnName: string) {
    let display = false;
    switch (columnName) {
    }
  }


  addItem(data: any) {
    if (this.config.idList === undefined || this.config.idList === null) {
      this.config.idList = [];
    }
    if (
      this.config.entiteList === undefined ||
      this.config.entiteList === null
    ) {
      this.config.entiteList = [];
    }

    if (
      this.isWholeEntite &&
      this.config.entiteList.filter((item) => item.id === data.id).length <= 0
    ) {
      this.config.entiteList.push(data);

      if (!this.datasource.data.some((item) => item.id === data.id)) {
        this.datasource.data = [...this.datasource.data, data];
      }
    }

    if (!this.isWholeEntite && this.config.idList.indexOf(data.id) === -1) {
      this.config.idList.push(data.id);

      //this.config.entiteList.push(data.id);
      if (!this.datasource.data.some((item) => item.id === data.id)) {
        this.datasource.data = [...this.datasource.data, data];
      }
    }

    if (data?.mapDescriptionVl) {
      this.searchArticlesCtrl.setValue(data?.mapDescriptionVl?.fr_FR); // set the initial value of the control
    }
  }

  ouvrirOnglet(data: any) {
  
    
    this.nom = data[this.displayedColumns[1]];
    if (this.entite === 'Picto') {
      this.nom = data['label'];
      this.nom = this.nom?.fr_FR;
      // on prend la valeur en francais par defaut we need to change this
    } else if (data?.mapdescription && data?.mapdescription?.fr_FR) {
      this.nom = data?.mapdescription?.fr_FR;
    } else if (data?.mapdescriptionVl && data?.mapdescriptionVl?.fr_FR) {
      this.nom = data?.mapdescriptionVl?.fr_FR;
    } else if (data?.maplocaletitre && data?.maplocaletitre?.fr_FR) {
      this.nom = data?.maplocaletitre?.fr_FR;
    } else if (this.entite === 'Adaptationplaque') {
      if (data?.produit?.code && data?.plaque?.code) {
        this.nom = data?.produit?.code + '-' + data?.plaque?.code;
      } else {
        this.nom = data?.produit + '-' + data?.plaque;
      }
    }

    this.dash.visualisation(
      this.nom,
      this.entite,
      `${data.id}`,
      '',
      100,
      this.config.typeName
    );
  }
}
